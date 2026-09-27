import PageSection from "../components/layout/PageSection";
import AboutExperience from "../components/about/AboutExperience";
import AboutSection from "../components/about/AboutSection";
import AboutTech from "../components/about/AboutTech";
import AboutInterests from "../components/about/AboutInterests";
import Byline from "../components/layout/Byline";
import {
  ABOUT_HEADING,
  ABOUT_NOTE,
  ABOUT_SECTIONS,
} from "../data/about.data";

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
  </PageSection>
);

export default AboutPage;
