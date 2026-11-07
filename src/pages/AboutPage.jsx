import { useRef } from "react";
import cn from "classnames";
import PageSection from "../components/layout/PageSection";
import AboutOpening from "../components/about/AboutOpening";
import AboutExperience from "../components/about/AboutExperience";
import PageBand from "../components/layout/PageBand";
import AboutTech from "../components/about/AboutTech";
import AboutInterests from "../components/about/AboutInterests";
import { ABOUT_SECTIONS } from "../data/about.data";
import { usePage } from "../routes/RouterContext";
import { useSplitReveal } from "../hooks/useSplitReveal";

// The About page: the Contact page's opening carrying this page's copy, then
// three banded sections. The opening replaces the masthead other pages below
// the homepage wear — it draws the byline and title itself, so a masthead above
// it would be both of those twice. See AboutOpening.
//
// Its own page, at /about, and its own chunk — the hero's shots and the
// project data aren't sent to someone who came here to read. The router mounts
// it below the hero for the length of the handoff and takes the URL over once
// it has the viewport, so the join reads as one document continuing while still
// being two pages: see Router.
//
// It carries no nav of its own. The bar that closes the hero is pinned to the foot
// of the viewport for every page below it (see SiteNav), so a second copy at
// the end of this one would be the same furniture drawn twice.
//
// Opaque and stacked above the hero, since the hero is sticky and this page
// covers it while the two share a document: see useHeroHandoff.
// On a phone the content sits on its block's colour, which the page's own tones
// weren't drawn for: `grid` all but vanishes on every block, and `ash` at label
// size fails on the blue and the taupe. Both become a share of the ink instead.
const BLOCK_RULE_CLASS =
  "max-md:[--grid:color-mix(in_oklab,var(--ink)_50%,transparent)]";
const BLOCK_ASH_CLASS =
  "max-md:[--ash:color-mix(in_oklab,var(--ink)_85%,transparent)]";
const BLOCK_MUTED_CLASS = cn(BLOCK_ASH_CLASS, BLOCK_RULE_CLASS);

const AboutPage = () => {
  const { isArriving } = usePage();
  const headingRef = useRef(null);
  useSplitReveal(headingRef, { enabled: !isArriving });

  return (
    <PageSection
      id="about"
      contained={false}
      additionalClasses="relative z-10 flex flex-col border-b border-grid bg-sheet font-epilogue text-ink [--grid:color-mix(in_oklab,var(--ink)_20%,transparent)]"
    >
      <AboutOpening headingRef={headingRef} />

      <PageBand
        index="01"
        tone="bg-block-about text-slate dark:text-chalk"
        mobileTone={cn(
          "max-md:bg-block-about max-md:[--grid:color-mix(in_oklab,var(--ink)_30%,transparent)] max-md:dark:[--grid:color-mix(in_oklab,var(--ink)_50%,transparent)]",
          BLOCK_ASH_CLASS,
        )}
        {...ABOUT_SECTIONS.experience}
      >
        <AboutExperience />
      </PageBand>

      <PageBand
        index="02"
        tone="bg-block-projects text-slate"
        mobileTone={cn(
          "max-md:bg-block-projects max-md:scheme-light",
          BLOCK_RULE_CLASS,
        )}
        {...ABOUT_SECTIONS.technologies}
      >
        <AboutTech />
      </PageBand>

      <PageBand
        index="03"
        tone="bg-block-contact text-slate dark:text-chalk"
        mobileTone={cn("max-md:bg-block-contact", BLOCK_MUTED_CLASS)}
        {...ABOUT_SECTIONS.interests}
      >
        <AboutInterests />
      </PageBand>
    </PageSection>
  );
};

export default AboutPage;
