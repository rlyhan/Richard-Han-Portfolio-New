import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ARRIVING_SLOT, EMPTY_SLOT, RouterContext } from "./RouterContext";
import {
  findRoute,
  getLoadedPage,
  loadPage,
  nextRouteOf,
  routeAfter,
  resolvePath,
  sectionSelectorOf,
} from "./routes";
import { getSectionFlowTop } from "../helpers/sectionScroll";
import { getLenis } from "../hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

// The scroll a page opens at is the router's to decide, not the browser's: it hands
// the URL over mid-scroll (see below), and an entry the browser restored to that
// offset would open the page part-way down — or, going back to the first page of a
// visit, part-way down a document built from other pages since.
//
// Stated for every entry, not once for the document: a later-pushed entry doesn't
// carry the value of the one before it.
const keepScrollOurs = () => {
  if ("scrollRestoration" in window.history)
    window.history.scrollRestoration = "manual";
};

keepScrollOurs();

// How long the scroll has to be quiet before the URL is handed over.
//
// The handover takes the page above out of the document and its height off the
// scroll position in the same frame — invisible standing still, but a stall
// mid-flick: the wheel's remaining momentum lives in the smooth scroller's target
// position, and re-seating it spends that momentum. So it waits for the gesture to
// finish, a beat after the takeover's scripted scroll lands anyway and unnoticeable
// while reading.
const SETTLE_MS = 140;

// Subpixel slack on the landing. Page zoom and a fractional viewport height both
// leave the scroll a hair short of a position summed off the layout.
const LANDING_SLACK = 1;

// When the next page's chunk is fetched, on a page the viewer is sitting still on.
// Late enough to stay out of the way of the current page's own work — its fonts, its
// images — and early enough to be here before the scroll asks for it.
const PREFETCH_DELAY = 800;

// How close to the end of what is in the document the viewer has to be before the
// next page is mounted below it, in viewports.
//
// A page isn't put in the document to be scrolled past: it's there so the join has
// something to play against — the last screenful of the page above. One viewport of
// warning is a full screen of scrolling before the hesitation starts, time enough
// for an already-fetched chunk to mount and its triggers to be measured, while
// keeping the page out of the document for everyone still reading the one above.
const STAGE_MARGIN = 1;

// Gives the smooth scroller a scroll position it did not perform itself. Lenis holds
// its own idea of where the page is and writes it back every frame, so setting the
// window alone is undone on the next tick.
//
// Stopped first, not merely told where it now is: a wheel gesture is a scroll Lenis
// is still easing out, and that easing survives a new position — it carries on
// toward wherever the gesture was heading, a place in the document just taken
// apart. Stopping drops it, the window is set, and starting again reads the
// position back off the page. A flick through a join stops where the join put it.
const seatScroll = (offset) => {
  const lenis = getLenis();

  lenis?.stop();
  window.scrollTo(0, offset);
  // Its limits were measured against the page that has just left.
  lenis?.resize();
  lenis?.start();
};

// The same position, put back a frame later if anything has moved it.
//
// For a history traversal and nothing else. The browser restores the entry's own
// scroll position after the event that took us there — a position in a document
// built from different pages, and one scrollRestoration won't talk it out of — so
// the seat has to outlast it by a frame.
//
// Never on a seat the viewer scrolled their way into: a handoff lands while the
// wheel may still be turning, and the scroll that arrives the frame after is
// theirs. Putting the page back would take a gesture off them and show as a jump
// down and back up in the same breath.
const holdSeat = (offset) => {
  requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - offset) < 1) return;

    seatScroll(offset);
  });
};

const scrollPageToTop = () => {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }

  // No Lenis means reduced motion, which is also what decides the behaviour here.
  window.scrollTo({ top: 0, behavior: "auto" });
};

// The site's pages, one URL at a time — and, for the length of a handoff, two of them
// in one document.
//
// Wraps the whole app rather than only the pages: the chrome that outlives them — the
// pinned nav bar, the footer — asks it where the site is and how to get elsewhere,
// and the pages themselves are mounted wherever PageOutlet is put.
//
// A page is not a screen that replaces another here. The scroll runs through the site
// in the order routes.js lists, and every join between two pages is the same
// sequence:
//
//   staged     the next page's chunk is fetched and the page is mounted BELOW the
//              current one, in the same scroll document. This is what lets the joins
//              stay exactly what they were when the whole site was one page: the
//              hero pins and empties out while About climbs over it, a section parks
//              and dissolves under the one arriving. See useHandoff.
//   the join   the scroll crosses it. Either the viewer scrolls there, or the
//              handoff's takeover spends the scroll for them, or a nav item asks for
//              the page and the router runs that same scroll — one path, so the
//              sequence is the same however it was asked for.
//   handover   the staged page has the viewport and the scroll has settled, so the
//              page above comes out of the document, its height comes off the scroll
//              position, and the URL becomes the staged page's. Nothing moves.
//
// Arriving at a page directly is the same site with the chain entered part-way: the
// page loads on its own, and stages the one after it on the first scroll.
const RouterProvider = ({ children }) => {
  // The path and the component are one piece of state, so there is no frame where
  // the URL says one page and the document holds another.
  const [current, setCurrent] = useState(() => {
    const path = resolvePath(window.location.pathname);
    return { path, Page: getLoadedPage(findRoute(path)) };
  });
  const { path, Page } = current;

  // The page mounted below the current one, as its path and its component together:
  // holding the component rather than a flag is what guarantees the two agree, and
  // that a page is never mounted for a join it doesn't belong to.
  const [staged, setStaged] = useState(null);

  // The page a nav item has asked for, on its way in over the top of this one. It is
  // mounted with the rest — the outlet holds it to the viewport while it travels
  // rather than laying it out — so that landing costs it nothing: the box it
  // arrives in is the box it stays in. See PageOutlet and useSwapTransition.
  const [swap, setSwap] = useState(null);

  // Bumped by a nav item that asks for the next page: the scroll it wants can only
  // run once that page is mounted, so the request outlives the click.
  const [advanceRequest, setAdvanceRequest] = useState(0);

  const route = findRoute(path);
  const nextRoute = nextRouteOf(route);
  const StagedPage =
    staged?.path && staged.path === nextRoute?.path ? staged.Page : null;
  const isNextStaged = StagedPage !== null;

  // The scroll the page in front leaves by, handed over by the page itself — see
  // useAdvance. A ref because it is called from events rather than rendered.
  // The page a swap is carrying in, if there is one.
  const SwapPage = swap?.Page ?? null;

  const advanceRef = useRef(null);
  // What the scroll has to be set to once the document has changed, applied before
  // the browser paints it. Set by whatever asked for the change, since only that
  // knows whether the page is being entered at the top or taken over mid-scroll.
  const handoverRef = useRef(null);

  // Only reached on a cold arrival — every other path loads the chunk before it
  // swaps the page in, so there is nothing to wait for by then.
  useEffect(() => {
    if (Page) return;

    let cancelled = false;

    loadPage(route)
      .then((Component) => {
        if (!cancelled) setCurrent({ path, Page: Component });
      })
      .catch((error) => {
        // Nothing to fall back to: the URL the server would serve is the one
        // that produced this. Left for the browser's own error surface.
        console.error(`Could not load ${path}`, error);
      });

    return () => {
      cancelled = true;
    };
  }, [Page, route, path]);

  const stageNext = useCallback(() => {
    if (!nextRoute) return Promise.resolve(false);

    return loadPage(nextRoute)
      .then((Component) => {
        setStaged({ path: nextRoute.path, Page: Component });
        return true;
      })
      .catch(() => false);
  }, [nextRoute]);

  const enterRoute = useCallback(
    (target, { push = true, offset = 0, hold = false } = {}) => {
      // A scripted scroll still pointing into the document about to be taken
      // apart. Killing it runs its own cleanup, which unlocks the page if it
      // was a takeover holding the scroll.
      gsap.killTweensOf(window);

      // And the animation that carried the arriving page in, done now — this is
      // the moment it was travelling toward. It belongs to the page being left,
      // and React doesn't run a leaving page's cleanup until it flushes passive
      // effects, after the next paint. Alive that long, it gets one more update
      // on the very frame the document changes: its trigger still describes a
      // document with both pages in it, the scroll is being re-seated for one,
      // and it reads the difference as progress to animate toward — the page
      // twitches down and back for a frame as the cleanup catches up.
      //
      // Cleared as well as killed: whatever the catch-up had left to spend is
      // still on the element, and taken here, before the document changes, it's
      // spent in the same breath as the seat and never paints.
      const arriving = document.getElementById(target.sectionId);
      if (arriving) {
        gsap.killTweensOf(arriving);
        gsap.set(arriving, { clearProps: "transform" });
      }

      handoverRef.current = { offset, hold };

      if (push) {
        window.history.pushState({ path: target.path }, "", target.path);
        keepScrollOurs();
      }

      setSwap(null);
      setStaged(null);
      setAdvanceRequest(0);
      setCurrent({ path: target.path, Page: getLoadedPage(target) });
    },
    [],
  );

  // Before the paint, never after: this is the frame the page above leaves the
  // document in, and the scroll has to lose that page's height in the same one.
  useLayoutEffect(() => {
    const handover = handoverRef.current;
    if (!handover) return;

    handoverRef.current = null;

    // ScrollTrigger saves the scroll position and puts it back across a refresh,
    // which is right for a resize and wrong here: the position it remembers was a
    // position in a document that no longer exists, and on a page returned to it
    // would drop the viewer part-way down instead of at the top.
    ScrollTrigger.clearScrollMemory();
    seatScroll(handover.offset);
    if (handover.hold) holdSeat(handover.offset);
  }, [current]);

  // The set of mounted pages has changed, so every page's position in the document
  // has too, and every trigger measured against it has to be re-resolved.
  //
  // A passive effect, and that's the whole of why: the page that just left takes
  // its scroll-driven animations with it, and React doesn't run an unmounting
  // page's cleanup until it flushes these. Refreshing earlier — in the layout
  // effect above, where the scroll is re-seated — would refresh tweens still
  // alive and still describing the document that's gone: the one carrying the
  // incoming page up would re-read its starting offset against a scroll now
  // seated at the top, applying it — the page drops a tenth of a screen for a
  // frame and springs back as the cleanup lands. Running after them, there's
  // nothing left of the old page to refresh.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [current, isNextStaged]);

  // The chunk, on a page the viewer has not moved on yet.
  useEffect(() => {
    if (!nextRoute) return;

    const warm = () => {
      loadPage(nextRoute).catch(() => {});
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(id);
    }

    const id = setTimeout(warm, PREFETCH_DELAY);
    return () => clearTimeout(id);
  }, [nextRoute]);

  // The page itself, mounted once the viewer is within reach of the join.
  //
  // While nothing is staged, the end of the document IS the end of this page, so
  // that is what the distance is measured against. A viewer who stays on the page
  // they opened never has the next one in their document at all — which is the
  // weight this was about — and one on their way down has it in place before the
  // hesitation that hands them over.
  useEffect(() => {
    if (!nextRoute || isNextStaged) return;

    let frame = null;

    const measure = () => {
      frame = null;

      // Standing still at the top is not on the way anywhere, however short
      // the page is.
      if (window.scrollY <= 0) return;

      const viewport = window.innerHeight;
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + viewport);
      if (remaining > viewport * STAGE_MARGIN) return;

      window.removeEventListener("scroll", onScroll);
      stageNext();
    };

    // Read in a frame of its own rather than in the handler: the page's height is
    // a layout read, and a scroll handler is the last place to force one.
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // A page opened part-way down — entered with the scroll the page above was
    // left at — may already be within reach of its own join.
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [nextRoute, isNextStaged, stageNext]);

  // The join, crossed: the staged page has the viewport, so the URL follows it.
  //
  // Position, not the scroll that got there — the takeover, a nav item's scroll,
  // the viewer's own wheel and a reduced-motion page with no runway at all arrive
  // at the same place, and all four are this.
  useEffect(() => {
    if (!isNextStaged || !nextRoute || swap) return;

    let timer = null;

    const handOver = () => {
      const section = document.getElementById(nextRoute.sectionId);
      if (!section) return;

      // Summed off the layout, as everywhere else: the staged page carries the
      // handoff's transform while it climbs, and a box read mid-climb is
      // displaced by however far it has left to go.
      const landing = getSectionFlowTop(section);
      if (window.scrollY + LANDING_SLACK < landing) return;

      // A scripted scroll is still spending the runway above.
      if (gsap.isTweening(window)) return;

      // Whatever is left over is scroll the viewer has spent inside the page
      // already, and it belongs to the page, not to the join.
      enterRoute(nextRoute, { offset: Math.max(window.scrollY - landing, 0) });
    };

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(handOver, SETTLE_MS);
    };

    // The join may already be behind us — a page staged into a document the
    // viewer is scrolled well down, a reload part-way through.
    timer = setTimeout(handOver, SETTLE_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isNextStaged, nextRoute, swap, enterRoute]);

  // A nav item asked for the next page, and the page it asked from is now mounted
  // below: the scroll that page leaves by can run. A frame's wait, so the triggers
  // refreshed above are measuring the document the scroll is about to cross.
  //
  // The scroll is always there to run: only a page with a `next` is ever asked this,
  // and a page with a `next` is a page with a runway to empty out across — which is
  // what it registers. See useAdvance.
  useEffect(() => {
    if (!advanceRequest || !isNextStaged) return;

    const frame = requestAnimationFrame(() => advanceRef.current?.());

    return () => cancelAnimationFrame(frame);
  }, [advanceRequest, isNextStaged]);

  useEffect(() => {
    const onPopState = () => {
      keepScrollOurs();

      const target = findRoute(resolvePath(window.location.pathname));
      if (!target || target.path === path) return;

      // Loaded before the swap, so going back never shows an empty document
      // — a page already visited is in hand, and this is only a wait the
      // first time a page is reached by the back button.
      loadPage(target)
        // hold, because this is the arrival the browser has its own opinion
        // about — see holdSeat.
        .then(() => enterRoute(target, { push: false, hold: true }))
        .catch(() => window.location.assign(target.path));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [path, enterRoute]);

  useEffect(() => {
    if (route) document.title = route.title;
  }, [route]);

  // The ground under the page, on the body rather than inside it, so it is up
  // while the chunk is still arriving and under an overscroll at either end.
  useEffect(() => {
    const ground = route?.ground;
    if (!ground) return;

    document.body.classList.add(ground);
    return () => document.body.classList.remove(ground);
  }, [route]);

  // Every way of asking for another page comes through here, so the rule about
  // which of them plays a join and which is a jump is stated once:
  //
  //   the page already up   back to the top of it
  //   the page this one hands over to   the join, played in full — the page's own
  //                                     scroll, the same one the viewer would get
  //                                     by scrolling there themselves
  //   anything else   a swap: this page lifts and fades, the one asked for comes
  //                    up from below the fold and takes the screen. The same move
  //                    the scroll join makes, spent in time rather than in scroll,
  //                    because there is no scroll between these two pages to spend.
  const navigate = useCallback(
    (to) => {
      const target = findRoute(to);
      if (!target || !route) return;

      // One at a time. A second page asked for mid-swap would be a third page
      // in the air, and the first would still be the one that lands.
      if (swap) return;

      if (target.path === route.path) {
        scrollPageToTop();
        return;
      }

      if (route.next === target.path) {
        stageNext().then((staged) => {
          if (staged) setAdvanceRequest((request) => request + 1);
        });
        return;
      }

      // Fetched before it is mounted, and mounted only here: until a nav item
      // is clicked there is no page after this one in the document at all —
      // which is what makes the foot of a page the foot of the document.
      loadPage(target)
        .then((Component) => setSwap({ path: target.path, Page: Component }))
        // The chunk is not to be had, so the URL goes to the server: a
        // full page load is slow, and it is not a dead link.
        .catch(() => window.location.assign(target.path));
    },
    [route, swap, stageNext],
  );

  // The swap has landed: the page it carried in is holding the screen, so it becomes
  // the document — entered at its top, which is the screenful already showing.
  const finishSwap = useCallback(() => {
    const target = swap && findRoute(swap.path);
    if (!target) return;

    enterRoute(target);
  }, [swap, enterRoute]);

  const prefetch = useCallback((to) => {
    const target = findRoute(to);
    if (target) loadPage(target).catch(() => {});
  }, []);

  const registerAdvance = useCallback((advance) => {
    advanceRef.current = advance;

    return () => {
      if (advanceRef.current === advance) advanceRef.current = null;
    };
  }, []);

  const frontSlot = useMemo(
    () => ({
      path,
      isFront: true,
      isArriving: false,
      nextPath: nextRoute?.path ?? null,
      nextSelector: sectionSelectorOf(nextRoute),
      isNextStaged,
    }),
    [path, nextRoute, isNextStaged],
  );

  // What PageOutlet mounts. Keyed by path, so a page that changes its part in the
  // document — staged below becoming the page in front, arriving over the top
  // becoming the page itself — keeps the DOM it already has.
  //
  // The page arriving by a swap goes FIRST and stays first. React reuses an
  // element when its key and parent match, but a node it has to move between
  // positions is disconnected on the way, and disconnecting cancels the CSS
  // animations inside it — a page's whole arrival replaying at the moment it
  // lands. Held at the head of the list, it's never moved; the pages under it
  // are simply deleted. Paint order isn't DOM order for it anyway — it's fixed,
  // over everything, until it settles. See PageOutlet.
  const pages = useMemo(
    () =>
      [
        SwapPage && {
          key: swap.path,
          Page: SwapPage,
          slot: { ...ARRIVING_SLOT, path: swap.path },
          arriving: true,
        },
        Page && { key: path, Page, slot: frontSlot, arriving: false },
        // A staged page is told its own path and nothing beyond it: it is not
        // the page the viewer is on, so it has no next page of its own to
        // reach for and nothing to advance to. See RouterContext.
        StagedPage && {
          key: nextRoute.path,
          Page: StagedPage,
          slot: { ...EMPTY_SLOT, path: nextRoute.path },
          arriving: false,
        },
      ].filter(Boolean),
    [SwapPage, swap, Page, path, StagedPage, nextRoute, frontSlot],
  );

  const routerValue = useMemo(
    () => ({
      path,
      pages,
      swap,
      // The page a swap carries out, named for the timeline that lifts it: the
      // one arriving now sits inside the same box, so the box itself can no
      // longer be the thing that moves. See useSwapTransition.
      leavingSelector: sectionSelectorOf(route),
      swapKey: swap?.path ?? null,
      finishSwap,
      navigate,
      prefetch,
      registerAdvance,
      // Whether this page draws the nav bar in its own layout, and so whether the
      // pinned copy waits for a floor at all rather than being free from the top.
      pageDrawsNav: Boolean(route?.hasOwnNav),
      // The floor that pinned copy answers for: it stays down until the page below
      // has taken over. Read as a selector so it's measured, not remembered.
      //
      // - the page below in table order, not the page the scroll joins to — the
      //   bar has to stay off the hero whether the way on is a scroll or a
      //   click. Until that page is in the document the selector matches
      //   nothing, which useRevealOnScrollUp reads as a floor below
      //   everything, so the bar never comes up over the hero's own copy.
      // - null with nothing below at all, which is Contact: it draws the bar
      //   itself and is the last page, so there's no floor to arrive at and it
      //   stays down the whole way — the scroll off its foot is the footer
      //   coming up, not a second bar.
      navFloorSelector: route?.hasOwnNav
        ? sectionSelectorOf(routeAfter(route))
        : null,
      // Changes whenever the document's pages do, for anything outside them
      // that measures a position and has to measure it again.
      layoutKey: `${path}:${isNextStaged}`,
    }),
    [
      path,
      route,
      isNextStaged,
      pages,
      swap,
      finishSwap,
      navigate,
      prefetch,
      registerAdvance,
    ],
  );

  return (
    <RouterContext.Provider value={routerValue}>
      {children}
    </RouterContext.Provider>
  );
};

export default RouterProvider;
