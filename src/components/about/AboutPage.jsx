import PageSection from "../layout/PageSection";
import AboutExperience from "./AboutExperience";
import AboutSection from "./AboutSection";
import AboutTech from "./AboutTech";
import AboutInterests from "./AboutInterests";
import LocationPinIcon from "../icons/LocationPinIcon";
import {
  ABOUT_HEADING,
  ABOUT_NOTE,
  ABOUT_SECTIONS,
} from "../../data/about.data";
import { INTRO_TOPLINE } from "../../data/home.data";

// The About page: a masthead and three banded sections.
//
// It carries no nav of its own. The bar that closes the hero is pinned to the foot
// of the viewport for the whole page below it (see SiteNav), so a second copy at
// the end of this one would be the same furniture drawn twice.
//
// The palette is the homepage's rather than the dark page's — cream ground, ink
// copy, a hairline between every band — so the hero handing over to it reads as one
// document continuing rather than as a second site starting. Opaque and stacked
// above the hero, because the hero is sticky and this is what covers it: see
// useHeroToAboutHandoff.
//
// contained: false — the banding runs to the viewport edge, so the page frame's max
// width and gutter would cut every rule short. Each band states the hero's own
// gutter instead.
const AboutPage = () => (
  <PageSection
    id="about"
    contained={false}
    additionalClasses="relative z-10 flex flex-col bg-cream font-epilogue text-ink"
  >
    {/* The masthead, set to the hero's recipe: the byline across the top, then
        the page's name at display size. */}
    <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
      <p className="flex items-center justify-between gap-4 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase">
        <span>{INTRO_TOPLINE.name}</span>
        {/* No cap on the location the way the hero puts one on its own byline:
            the hero hides the name below md and gives the line the whole width,
            where this page keeps both, and the pair still fits one line at
            320px. */}
        <span className="flex items-center gap-2">
          <LocationPinIcon className="size-3 shrink-0" />
          <span className="translate-y-px text-right">
            {INTRO_TOPLINE.location}
          </span>
        </span>
      </p>

      <h1 className="mt-14 font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:mt-[clamp(2.375rem,7vh,5.625rem)] md:text-[clamp(3.375rem,5.9vw,5.875rem)]">
        {ABOUT_HEADING}
      </h1>

      {/* The hero's closing note runs to 25.5rem; this is narrower still, so it
          reads as a standfirst under the heading rather than as the start of the
          page's copy. */}
      <p className="mt-7 max-w-[20.3125rem] text-[0.8125rem] leading-[1.65] text-ash">
        {ABOUT_NOTE}
      </p>
    </header>

    <AboutSection index="01" {...ABOUT_SECTIONS.experience}>
      <AboutExperience />
    </AboutSection>

    {/* The technology grid is its own grid of columns rather than a single body
        column, so it takes the band's body slot whole. */}
    <AboutSection index="02" {...ABOUT_SECTIONS.technologies}>
      <AboutTech />
    </AboutSection>

    <AboutSection index="03" {...ABOUT_SECTIONS.interests}>
      <AboutInterests />
    </AboutSection>
  </PageSection>
);

export default AboutPage;
