import { useCallback, useRef } from "react";
import PageSection from "../components/layout/PageSection";
import ScrollCue from "../components/common/Buttons/ScrollCue";
import HomeIntro from "../components/home/HomeIntro";
import HomeWork from "../components/home/HomeWork";
import NavMenu from "../components/layout/NavMenu";
import { INTRO_LINES } from "../data/home.data";
import { useAdvance, usePage, useRouter } from "../routes/RouterContext";
import { PATHS } from "../routes/routes";
import { useNavItems } from "../hooks/useNavLinks";
import { useHeroHandoff } from "../hooks/useHeroHandoff";
import { useIsNearPageTop } from "../hooks/useIsNearPageTop";
import { useSplitReveal } from "../hooks/useSplitReveal";

// Scrolled less than this, the hero still owns the viewport, so the cue still applies.
const NEAR_TOP_THRESHOLD = 40;

const CUE_POSITION_CLASS =
  "top-[1.35rem] justify-center md:top-auto md:bottom-6";

// What the hero's exit throws off screen, in order — the stagger is indexed off
// this list, so the spread runs down the left column and then takes the work
// panel with it (see useHeroHandoff for each index's travel).
//
// Six is the ceiling: scrubbed across a unit-length timeline, a seventh would
// push the last fade past the runway's end, leaving the takeover firing over
// content still on screen.
const NOTE_LINE_INDEX = INTRO_LINES.length;
const WORK_LINE_INDEX = NOTE_LINE_INDEX + 1;

// The home page: the hero, and the runway it empties out across.
//
// The page below it is the router's to mount, not this page's to know — this
// page only says where the scroll it leaves by goes, and the router decides
// when there's something down there to go to. See Router for the join, and
// useHeroHandoff for the exit played across the runway.
//
// The scroll join is TEMPORARILY OFF — see routes, where this page's `next` is
// commented out. Without it there's no runway, no exit, nothing staged below:
// the way on is the cue or the nav bar, played as a swap like every other page.
// The machinery is still here and wired — what follows describes it running,
// which it does again the moment `next` comes back.
const HomePage = () => {
  const { navigate } = useRouter();
  const { nextPath, nextSelector, isNextStaged, isArriving } = usePage();

  const headingRef = useRef(null);
  useSplitReveal(headingRef, { enabled: !isArriving });

  const displayLineRefs = useRef([]);
  const outroLineRefs = useRef([]);
  const runwayRef = useRef(null);

  // Stable, so a re-render on scroll doesn't detach and reattach every ref in the
  // hero. The elements themselves never change identity either way, so the exit's
  // timeline keeps pointing at the right things.
  const setDisplayLine = useCallback((index, el) => {
    displayLineRefs.current[index] = el;
  }, []);
  const setNoteRef = useCallback((el) => {
    displayLineRefs.current[NOTE_LINE_INDEX] = el;
  }, []);
  const setWorkRef = useCallback((el) => {
    displayLineRefs.current[WORK_LINE_INDEX] = el;
  }, []);
  // The outro sinks in the order it's collected: the byline atop the intro panel
  // first, then the name and links at the foot of the hero. Three is the ceiling
  // here for the same reason six is above — the last has to land inside the runway.
  const setToplineRef = useCallback((el) => {
    outroLineRefs.current[0] = el;
  }, []);
  const setNameRef = useCallback((el) => {
    outroLineRefs.current[1] = el;
  }, []);
  const setNavRef = useCallback((el) => {
    outroLineRefs.current[2] = el;
  }, []);

  const { scrollToNext, isScrollingToNext } = useHeroHandoff({
    displayLineRefs,
    outroLineRefs,
    runwayRef,
    nextSelector,
    isNextStaged,
  });

  // The scroll this page leaves by, handed to the router so a nav item asking for
  // the page below — from either copy of the bar — runs this scripted scroll
  // instead of a jump. Every fade scrubbed off the way plays as it would have, and
  // a gesture mid-flight hands control straight back.
  useAdvance(scrollToNext);

  // Through the router, not straight into the scroll above — the way on is the
  // router's decision either way: with a `next`, the page below isn't mounted
  // yet and is staged as the join comes into reach, with the router fetching it
  // and playing this page's exit across it; without one, the same call is a swap.
  //
  // Named outright in that second case, since there's no `next` for the router
  // to read the way on from. Either way the cue leads to About.
  const onwardPath = nextPath ?? PATHS.about;
  const goToNextPage = useCallback(
    () => navigate(onwardPath),
    [navigate, onwardPath],
  );

  const navItems = useNavItems();

  // Any scroll away from the hero retires the cue, including the one it starts
  // itself — but only where there's a runway to scroll along. Without one the
  // hero is the whole page, and the only scroll under it is the footer's slack,
  // where a cue going away would read as the way to the footer, not to About.
  const isNearPageTop = useIsNearPageTop(NEAR_TOP_THRESHOLD);
  const isCueVisible = (!nextPath || isNearPageTop) && !isScrollingToNext;

  return (
    <>
      <PageSection
        id="home"
        contained={false}
        additionalClasses="sticky top-0 flex h-svh flex-col overflow-x-clip bg-cream text-ink"
      >
        <div className="flex min-h-0 flex-1 flex-col md:grid md:max-wide:grid-cols-[minmax(0,44%)_minmax(0,56%)] wide:grid-cols-[minmax(0,48%)_minmax(0,52%)]">
          <HomeIntro
            headingRef={headingRef}
            setLineRef={setDisplayLine}
            setNoteRef={setNoteRef}
            setToplineRef={setToplineRef}
          />
          <HomeWork setGridRef={setWorkRef} />
        </div>

        <NavMenu
          items={navItems}
          setNameRef={setNameRef}
          setNavRef={setNavRef}
        />

        <ScrollCue
          onClick={goToNextPage}
          visible={isCueVisible}
          label={nextPath ? "Scroll to the About page" : "Go to the About page"}
          positionClassName={CUE_POSITION_CLASS}
        />
      </PageSection>

      {nextPath && (
        <div
          ref={runwayRef}
          aria-hidden="true"
          className="h-[90svh] motion-reduce:h-0! md:h-[140svh]"
        />
      )}
    </>
  );
};

export default HomePage;
