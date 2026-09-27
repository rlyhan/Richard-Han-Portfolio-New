import { useCallback, useRef } from "react";
import PageSection from "../components/layout/PageSection";
import ScrollCue from "../components/common/Buttons/ScrollCue";
import HomeIntro from "../components/home/HomeIntro";
import HomeWork from "../components/home/HomeWork";
import NavMenu from "../components/layout/NavMenu";
import { INTRO_LINES } from "../data/home.data";
import { useAdvance, usePage, useRouter } from "../routes/RouterContext";
import { useNavItems } from "../routes/useNavLinks";
import { useHeroHandoff } from "../hooks/useHeroHandoff";
import { useIsNearPageTop } from "../hooks/useIsNearPageTop";

// Scrolled less than this, the hero still owns the viewport, so the cue still applies.
const NEAR_TOP_THRESHOLD = 40;

// What the hero's exit throws off the screen, in the order it goes. The stagger is
// indexed off this list, so the spread runs down the left column and then takes the
// work panel with it — see useHeroHandoff for the travel each index gets.
//
// Six is the ceiling: the exit is scrubbed across a unit-length timeline, and a
// seventh would push the last fade past the end of the runway, leaving the takeover
// to fire over content still on screen.
const NOTE_LINE_INDEX = INTRO_LINES.length;
const WORK_LINE_INDEX = NOTE_LINE_INDEX + 1;

// The home page: the hero, and the runway it empties out across.
//
// The page below it is the router's to mount, not this page's to know — all this page
// says is where the scroll it leaves by goes, and the router decides when there is
// something down there to go to. See Router for the join, and useHeroHandoff for the
// exit this page plays across the runway.
const HomePage = () => {
  const { navigate } = useRouter();
  const { nextPath, nextSelector, isNextStaged } = usePage();

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
  // The outro sinks in the order it is collected: the byline at the top of the
  // intro panel first, then the name and the links at the foot of the hero. Three
  // planes is the ceiling here for the same reason six is above — the last of them
  // has to land inside the runway.
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

  // The scroll this page leaves by, handed to the router so that a nav item asking
  // for the page below — from either copy of the bar — runs this one scripted scroll
  // rather than a jump. Every fade scrubbed off the way there plays as it would have,
  // and a gesture mid-flight hands control straight back.
  useAdvance(scrollToNext);

  // Through the router rather than straight into the scroll above: at the top of the
  // hero the page below is not mounted yet — it is staged as the join comes into
  // reach — and the router is what fetches it and then plays this page's own exit
  // across it.
  const goToNextPage = useCallback(() => navigate(nextPath), [navigate, nextPath]);

  const navItems = useNavItems();

  // The cue belongs to the top of the page: any scroll away from the hero retires it,
  // including the one the cue itself starts.
  const isCueVisible =
    useIsNearPageTop(NEAR_TOP_THRESHOLD) && !isScrollingToNext;

  // contained: false — the hero is the one section that runs to the viewport edge,
  // so it opts out of the page frame the rest of the page sits in.
  //
  // h-svh, because that is what lets flex divide the hero: with an auto height the
  // container sizes to its content, and a spread of images has a max-content height
  // far taller than the screen. Both panels clip their own overflow, so a viewport
  // too short to divide loses the bottom of the spread rather than spilling it over
  // About.
  //
  // At every size, not just from md up. On a phone it used to be min-h-svh and a
  // stack sized by its own copy — which put the nav below the fold on any screen
  // shorter than about 780px, and a sticky hero has no scroll left to reach it. One
  // screen tall is what makes the division below binding, so the work panel gives up
  // the height the copy column needs instead of the bar at the foot going off-screen.
  //
  // sticky, so the hero holds the viewport while About scrolls over it. Its
  // containing block is the wrapper it shares with About in App, which ends the
  // stickiness once About has fully covered it.
  return (
    <>
      <PageSection
        id="home"
        contained={false}
        additionalClasses="sticky top-0 flex h-svh flex-col overflow-x-clip bg-cream text-ink"
      >
        {/* flex-1, not a calc against the footer's nominal height: the name block
                    is display type and sets its own height, so measuring the spread
                    off a guess at the footer leaves the hero taller than the viewport
                    and the nav below the fold. Letting flex divide what's left keeps
                    the whole hero inside one screen at any size. */}
        {/* The spread keeps the larger share of the width at every size — three
                    framed shots need more room than four lines of type do — but the gap
                    closes at 1440px, where there is width enough for the halves to run
                    near even: 56/44 below it, 52/48 above. */}
        <div className="flex min-h-0 flex-1 flex-col md:grid md:max-wide:grid-cols-[minmax(0,44%)_minmax(0,56%)] wide:grid-cols-[minmax(0,48%)_minmax(0,52%)]">
          <HomeIntro
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
      </PageSection>

      {/* The runway: the scroll where the hero holds the viewport alone and empties
                out, before the handoff takes over into the page below. Carries no
                content, so its only job is height — and it's what every trigger in the
                handoff measures against, hence the ref.

                Reduced motion collapses it: with the fades gone there's nothing to
                watch, and it would read as a dead screen. */}
      <div
        ref={runwayRef}
        aria-hidden="true"
        className="h-[140svh] motion-reduce:h-0"
      />

      {/* From md up the cue lands in the middle of the nav bar, between the name and
          the section links — the one part of that bar left empty for it. On a phone
          the bar is a single row with no middle to sit in, so the cue goes to the
          top-right corner instead, and the intro panel's top padding is what keeps
          the byline clear of it. */}
      <ScrollCue
        onClick={goToNextPage}
        visible={isCueVisible}
        label="Scroll to the About page"
        positionClassName="top-[1.35rem] justify-end pr-[1.35rem] md:top-auto md:bottom-6 md:justify-center md:pr-0"
      />
    </>
  );
};

export default HomePage;
