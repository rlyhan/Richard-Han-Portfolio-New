import { useCallback } from "react";
import PageSection from "../layout/PageSection";
import NavMenu from "../home/NavMenu";
import BackToTop from "../common/Buttons/BackToTop";
import AboutExperience from "./AboutExperience";
import AboutSection from "./AboutSection";
import AboutTech from "./AboutTech";
import LocationPinIcon from "../icons/LocationPinIcon";
import {
  ABOUT_HEADING,
  ABOUT_NOTE,
  ABOUT_SECTIONS,
} from "../../data/about.data";
import { INTRO_TOPLINE } from "../../data/home.data";
import { useCueScroll } from "../../hooks/useCueScroll";
import AboutInterests from "./AboutInterests";

const AboutPage = () => {
  const { scrollToTarget: scrollToAbout } = useCueScroll("#about");
  const { scrollToTarget: scrollToProjects } = useCueScroll("#projects");
  const { scrollToTarget: scrollToContact } = useCueScroll("#contact");

  // As in Home: the href is the real destination and this only upgrades the
  // jump, so modified clicks and a page without JS both still work.
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

  const navItems = [
    { id: "about", label: "About", onSelect: handleNavClick(scrollToAbout) },
    {
      id: "projects",
      label: "Projects",
      onSelect: handleNavClick(scrollToProjects),
    },
    {
      id: "contact",
      label: "Contact",
      onSelect: handleNavClick(scrollToContact),
    },
  ];

  return (
    <>
      <PageSection
        id="about"
        contained={false}
        additionalClasses="relative z-10 flex flex-col bg-cream font-epilogue text-ink"
      >
        <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
          <p className="flex items-center justify-between gap-4 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase">
            <span>{INTRO_TOPLINE.name}</span>
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

          <p className="mt-7 max-w-[20.3125rem] text-[0.8125rem] leading-[1.65] text-ash">
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

      <NavMenu items={navItems} ariaLabel="Portfolio sections, page footer">
        <BackToTop onClick={scrollToAbout} />
      </NavMenu>
    </>
  );
};

export default AboutPage;
