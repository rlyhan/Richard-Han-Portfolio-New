import { useCallback, useRef } from "react";
import PageSection from "./layout/PageSection";
import ScrollCue from "./common/Buttons/ScrollCue";
import HomeIntro from "./home/HomeIntro";
import HomeWork from "./home/HomeWork";
import NavMenu from "./home/NavMenu";
import { INTRO_LINES } from "../data/home.data";
import { useCueScroll } from "../hooks/useCueScroll";
import { useHeroToAboutHandoff } from "../hooks/useHeroToAboutHandoff";
import { useIsNearPageTop } from "../hooks/useIsNearPageTop";
import { useKeyShortcut } from "../hooks/useKeyShortcut";

// Scrolled less than this, the hero still owns the viewport, so the cue and its
// shortcut both still apply.
const NEAR_TOP_THRESHOLD = 40;

// What the hero's exit throws off the screen, in the order it goes. The stagger is
// indexed off this list, so the spread runs down the left column and then takes the
// work panel with it — see useHeroToAboutHandoff for the travel each index gets.
//
// Six is the ceiling: the exit is scrubbed across a unit-length timeline, and a
// seventh would push the last fade past the end of the runway, leaving the takeover
// to fire over content still on screen.
const NOTE_LINE_INDEX = INTRO_LINES.length;
const WORK_LINE_INDEX = NOTE_LINE_INDEX + 1;

const Home = () => {
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

  const { scrollToAbout, isScrollingToAbout } = useHeroToAboutHandoff({
    displayLineRefs,
    outroLineRefs,
    runwayRef,
  });

  // The rest of the page from the hero's own nav, on the same terms as the cue's
  // shortcut: one scripted scroll, so every fade scrubbed off the way there plays
  // as it would have, and a gesture mid-flight hands control straight back.
  const { scrollToTarget: scrollToProjects } = useCueScroll("#projects");
  const { scrollToTarget: scrollToContact } = useCueScroll("#contact");

  // The href is the real destination; this only upgrades the jump. Left as an
  // ordinary anchor for modified clicks and for a page without JS.
  const handleNavClick = useCallback(
    (scroll) => (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      scroll();
    },
    [],
  );

  const selectAbout = handleNavClick(scrollToAbout);
  const selectProjects = handleNavClick(scrollToProjects);
  const selectContact = handleNavClick(scrollToContact);

  const navItems = [
    { id: "about", label: "About", onSelect: selectAbout },
    { id: "projects", label: "Projects", onSelect: selectProjects },
    { id: "contact", label: "Contact", onSelect: selectContact },
  ];

  // The cue belongs to the top of the page: any scroll away from the hero retires
  // it, including the one the cue itself starts.
  const isCueVisible =
    useIsNearPageTop(NEAR_TOP_THRESHOLD) && !isScrollingToAbout;

  // Space is the cue's gesture from the keyboard, bound on the same terms: past
  // the hero it goes back to being page-down.
  useKeyShortcut("Space", scrollToAbout, { enabled: isCueVisible });

  // contained: false — the hero is the one section that runs to the viewport edge,
  // so it opts out of the page frame the rest of the page sits in.
  //
  // h-svh from md up, because that is what lets flex divide the hero: with an auto
  // height the container sizes to its content, and a spread of images has a
  // max-content height far taller than the screen. Both panels clip their own
  // overflow, so a viewport too short to divide loses the bottom of the spread
  // rather than spilling it over About.
  //
  // Below md the hero is a stack sized by its own copy, so it keeps min-h and grows.
  //
  // sticky, so the hero holds the viewport while About scrolls over it. Its
  // containing block is the wrapper it shares with About in App, which ends the
  // stickiness once About has fully covered it.
  return (
    <>
      <PageSection
        id="home"
        contained={false}
        additionalClasses="sticky top-0 flex min-h-svh flex-col overflow-x-clip bg-cream text-ink md:h-svh"
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
          <HomeWork setGridRef={setWorkRef} onSelectProject={selectProjects} />
        </div>

        <NavMenu
          items={navItems}
          setNameRef={setNameRef}
          setNavRef={setNavRef}
        />
      </PageSection>

      {/* The runway: the scroll where the hero holds the viewport alone and empties
                out, before the handoff takes over into About. Carries no content, so its
                only job is height — and it's what every trigger in the handoff measures
                against, hence the ref.

                Reduced motion collapses it: with the fades gone there's nothing to
                watch, and it would read as a dead screen. */}
      <div
        ref={runwayRef}
        aria-hidden="true"
        className="h-[140svh] motion-reduce:h-0"
      />

      {/* From md up the cue lands in the middle of the nav bar, between the name
                and the section links — the one part of that bar left empty for it. On a
                phone the bar is a single 45px row with no middle to sit in, so the cue
                goes to the top-right corner instead, and the intro panel's top padding
                is what keeps the byline clear of it. */}
      <ScrollCue
        onClick={scrollToAbout}
        tone="ink"
        visible={isCueVisible}
        positionClassName="top-[1.35rem] justify-end pr-[1.35rem] md:top-auto md:bottom-6 md:justify-center md:pr-0"
      />
    </>
  );
};

export default Home;
