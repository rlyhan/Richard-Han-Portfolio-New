import cn from "classnames";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import AwardIcon from "../icons/AwardIcon";
import SplitLine from "../common/SplitLine";
import ThemeToggle from "../common/Buttons/ThemeToggle";
import { useNavLink } from "../../hooks/useNavLinks";
import { EYEBROW_LABEL_CLASS } from "../layout/sharedClasses";
import { PATHS } from "../../routes/routes";

const META_CLASS =
  "inline-flex items-center gap-2 border border-grid bg-shell px-3.5 py-[0.5625rem] font-epilogue text-[0.6875rem] leading-none font-medium tracking-[0.03em] text-ink uppercase";

const META_LINK_CLASS =
  "transition-colors duration-200 hover:border-ash focus-visible:outline-ink motion-reduce:transition-none";

const META_ICON_CLASS = "size-[0.6875rem] shrink-0 text-ash";

// A write-up's masthead: the way back and the theme toggle across the top, the project's name
// at display size, the line of copy the Projects page captions it with, and the facts
// about it.
//
// Not PageMasthead, the Projects page's. Three things differ, and
// all three are what makes this a write-up rather than a page of the site: the
// line above the heading is the way back, not the location; the
// heading is set smaller since a project's name runs longer than one word; and
// the facts below the copy have no equivalent up there.
const ProjectMasthead = ({ project, headingRef }) => {
  const { name, category, association, description, url, award } =
    project;
  const backLink = useNavLink(PATHS.projects);

  return (
    <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          EYEBROW_LABEL_CLASS,
        )}
      >
        <a
          {...backLink}
          className="inline-flex items-center gap-[0.4375rem] transition-colors duration-200 hover:text-ink focus-visible:outline-ink motion-reduce:transition-none"
        >
          <ArrowDownIcon className="size-3 shrink-0 rotate-90" />
          All projects
        </a>

        <ThemeToggle />
      </div>

      <h1
        ref={headingRef}
        className="mt-14 font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:mt-[clamp(2.375rem,7vh,5.625rem)] md:text-[clamp(2.75rem,4.6vw,4.75rem)]"
      >
        <SplitLine text={name} />
      </h1>

      <p className="mt-7 max-w-[52ch] text-base leading-[1.5] text-ink md:text-xl md:leading-[1.45]">
        {description}
      </p>

      <ul className="mt-[1.875rem] flex flex-wrap gap-2.5">
        <li className={META_CLASS}>{category}</li>

        <li className={META_CLASS}>{association}</li>

        {award && (
          <li>
            <a
              href={award.url}
              target="_blank"
              rel="noreferrer"
              className={cn(META_CLASS, META_LINK_CLASS)}
            >
              <AwardIcon className={META_ICON_CLASS} />
              {award.description}
            </a>
          </li>
        )}

        {url && (
          <li>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={cn(META_CLASS, META_LINK_CLASS)}
            >
              Visit site
              <ArrowUpRightIcon className={META_ICON_CLASS} />
            </a>
          </li>
        )}
      </ul>
    </header>
  );
};

export default ProjectMasthead;
