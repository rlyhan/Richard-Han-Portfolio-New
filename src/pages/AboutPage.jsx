import PageSection from "../components/layout/PageSection";
import AboutOpening from "../components/about/AboutOpening";
import AboutExperience from "../components/about/AboutExperience";
import PageBand from "../components/layout/PageBand";
import AboutTech from "../components/about/AboutTech";
import AboutInterests from "../components/about/AboutInterests";
import { ABOUT_SECTIONS } from "../data/about.data";

// The About page: the Contact page's opening carrying this page's copy, then three
// banded sections. The opening replaces the masthead the other pages below the
// homepage wear — it draws the byline and the title itself, so a masthead above it
// would be both of those twice. See AboutOpening.
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
const AboutPage = () => (
  <PageSection
    id="about"
    contained={false}
    additionalClasses="relative z-10 flex flex-col bg-cream font-epilogue text-ink"
  >
    <AboutOpening />

    <PageBand index="01" {...ABOUT_SECTIONS.experience}>
      <AboutExperience />
    </PageBand>

    <PageBand index="02" {...ABOUT_SECTIONS.technologies}>
      <AboutTech />
    </PageBand>

    <PageBand index="03" {...ABOUT_SECTIONS.interests}>
      <AboutInterests />
    </PageBand>
  </PageSection>
);

export default AboutPage;
