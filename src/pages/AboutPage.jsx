import { useCallback, useRef } from "react";
import PageSection from "../components/layout/PageSection";
import ScrollCue from "../components/common/Buttons/ScrollCue";
import AboutExperience from "../components/about/AboutExperience";
import AboutSection from "../components/about/AboutSection";
import AboutTech from "../components/about/AboutTech";
import AboutInterests from "../components/about/AboutInterests";
import Byline from "../components/layout/Byline";
import { useAdvance, usePage, useRouter } from "../routes/RouterContext";
import { useKeyShortcut } from "../hooks/useKeyShortcut";
import { useSectionHandoff } from "../hooks/useSectionHandoff";
import {
  ABOUT_HEADING,
  ABOUT_NOTE,
  ABOUT_SECTIONS,
} from "../data/about.data";

// The About page: a masthead and three banded sections, and the runway it parks on
// before handing over to the next page.
//
// Its own page, at /about, and its own chunk — the hero's spread and the project data
// are not sent to someone who came here to read. The router mounts it below the hero
// for the length of the handoff and takes the URL over once it has the viewport, so
// the join reads as one document continuing while still being two pages: see Router.
//
// It carries no nav of its own. The bar that closes the hero is pinned to the foot
// of the viewport for every page below it (see SiteNav), so a second copy at
// the end of this one would be the same furniture drawn twice.
//
// The palette is the homepage's rather than the dark page's — cream ground, ink
// copy, a hairline between every band — so the hero handing over to it reads as one
// document continuing rather than as a second site starting. Opaque and stacked
// above the hero, because the hero is sticky and this is what covers it while the
// two are in the same document: see useHeroHandoff.
//
// contained: false — the banding runs to the viewport edge, so the page frame's max
// width and gutter would cut every rule short. Each band states the hero's own
// gutter instead.
const AboutPage = () => {
  const contentRef = useRef(null);
  const runwayRef = useRef(null);

  const { navigate } = useRouter();
  const { nextPath, nextSelector, isNextStaged } = usePage();

  // The hesitation between this page and the one after it, on the same terms as the
  // one between Projects and Contact — see useSectionHandoff. Every join on the site
  // is a page holding the view, emptying, and then handing the scroll on; reaching
  // the end of this page's last band used to be the one that wasn't.
  const { scrollToNext, isCueVisible } = useSectionHandoff({
    contentRef,
    runwayRef,
    nextSelector,
    isNextStaged,
  });

  // The scroll this page leaves by, for the nav bar to use instead of a jump when
  // what it is asked for is the page this one hands over to.
  useAdvance(scrollToNext);

  // Through the router: the page below is not mounted until the join is close, and
  // asking for it early — from the cue, or from the bar — is asking the router to
  // fetch it and then play this same scroll.
  const goToNextPage = useCallback(() => navigate(nextPath), [navigate, nextPath]);

  // Space is the cue's gesture from the keyboard, bound only while the cue is up:
  // anywhere else on the page it goes back to being page-down.
  useKeyShortcut("Space", goToNextPage, { enabled: isCueVisible });

  return (
    <>
      <PageSection
        id="about"
        contained={false}
        additionalClasses="relative z-10 flex flex-col bg-cream font-epilogue text-ink"
      >
        {/* Held by useSectionHandoff once its bottom edge reaches the middle of the
            viewport, dissolving as the runway below passes. One wrapper around the
            whole page, because what parks is the page, not its last band. */}
        <div ref={contentRef}>
          <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
            <Byline />

            <h1 className="mt-14 font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:mt-[clamp(2.375rem,7vh,5.625rem)] md:text-[clamp(3.375rem,5.9vw,5.875rem)]">
              {ABOUT_HEADING}
            </h1>

            <p className="mt-7 max-w-[25rem] text-[0.8125rem] leading-[1.65] text-ash">
              {ABOUT_NOTE}
            </p>
          </header>

          <AboutSection index="01" {...ABOUT_SECTIONS.experience}>
            <AboutExperience />
          </AboutSection>

          <AboutSection index="02" {...ABOUT_SECTIONS.technologies}>
            <AboutTech />
          </AboutSection>

          <AboutSection index="03" {...ABOUT_SECTIONS.interests}>
            <AboutInterests />
          </AboutSection>
        </div>

        {/* The runway: the scroll the hesitation is spent against, before the handoff
            takes over into the next page. Carries no content, so its only job is
            height — and it's what every trigger in the handoff measures against,
            hence the ref. Inside the section, so it is the page's own cream rather
            than a gap in the middle of the site.

            Reduced motion collapses it, back to the next page following this one
            directly: with the park and its dissolve gone there would be nothing to
            watch, and it would read as a dead screen. */}
        <div ref={runwayRef} aria-hidden="true" className="h-[80svh] motion-reduce:h-0" />
      </PageSection>

      {/* Outside the section, because the section holds the transform the park is
          made of — and a transformed ancestor becomes the containing block for
          `position: fixed`, so the cue would sit against the page rather than the
          viewport.

          Up only while the content is held, so it never floats over a page already
          on screen. `ink`, because this page is paper end to end. */}
      <ScrollCue
        onClick={goToNextPage}
        tone="ink"
        visible={isCueVisible}
        label="Scroll to the Projects page"
      />
    </>
  );
};

export default AboutPage;
