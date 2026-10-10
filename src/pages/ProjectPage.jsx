import { useRef } from "react";
import cn from "classnames";
import PageSection from "../components/layout/PageSection";
import ArticleParagraphs from "../components/layout/ArticleParagraphs";
import ProjectMasthead from "../components/projects/ProjectMasthead";
import MattedShot from "../components/common/MattedShot";
import {
  ARTICLE_ROW_CLASS,
  EYEBROW_LABEL_CLASS,
  IMAGE_FALLBACK_CLASS,
} from "../components/layout/sharedClasses";
import { usePage } from "../routes/RouterContext";
import { useSplitReveal } from "../hooks/useSplitReveal";
import { projectPathOf, projectSectionId } from "../routes/routes";
import PROJECTS from "../data/projects.data";
import { fitOf } from "../data/shots.data";

const RAIL_VALUE_CLASS = "text-[0.8125rem] leading-[1.45] font-medium text-ink";

const TECH_ITEM_CLASS = `${RAIL_VALUE_CLASS} whitespace-nowrap`;

// One project's write-up, at /projects/<id>.
//
// Which project it is comes off this page's own path, not a prop — the outlet
// mounts a page with none (see PageOutlet). Its own, not the site's, since a
// swap carries this page in while the site is still at the Projects page behind
// it. The route table builds these paths off the same list this reads, so a
// path the router resolved always names a project here.
//
// Every write-up shares this one chunk, which is why the page is the component and the
// project is data: a chunk each would be fetched on the click that opened it, where
// this one is in hand from the first tile the viewer hovers.
//
// The masthead and shot are the page's chrome; the facts and the copy are the
// write-up itself, so only those sit inside the <article>.
const ProjectPage = () => {
  const { path, isArriving } = usePage();
  const headingRef = useRef(null);
  useSplitReveal(headingRef, { enabled: !isArriving });

  const project = PROJECTS.find(({ id }) => projectPathOf(id) === path);
  const { id, name, year, images, idea, work_involved, technologies } = project;
  const image = images?.[0];
  const fit = image && fitOf(image);

  return (
    <PageSection
      id={projectSectionId(id)}
      contained={false}
      additionalClasses="flex flex-col bg-cream font-epilogue text-ink"
    >
      <ProjectMasthead project={project} headingRef={headingRef} />

      <figure className="px-[1.4rem] pb-[2.625rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pb-[3.25rem]">
        <div className="relative h-[23.75rem] overflow-hidden bg-frame md:h-[clamp(21.25rem,52vw,40rem)]">
          <div
            className={cn(
              "absolute overflow-hidden",
              fit === "bleed"
                ? "inset-0"
                : "top-3.5 right-5 bottom-6 left-5 flex items-center justify-center md:top-5 md:right-[2.125rem] md:bottom-[2.125rem] md:left-[2.125rem]",
            )}
          >
            {image ? (
              <MattedShot
                src={image}
                alt={`The ${name} site`}
                eager
                fit={fit}
              />
            ) : (
              <div
                aria-hidden="true"
                className={IMAGE_FALLBACK_CLASS}
              />
            )}
          </div>
        </div>
      </figure>

      <article className="flex flex-col bg-inverse px-[1.4rem] py-[2.625rem] [--ash:var(--inverse-ash)] [--grid:var(--inverse-grid)] [--ink:var(--inverse-ink)] selection:bg-inverse-ink selection:text-inverse md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:py-[3.25rem]">
        <div className={ARTICLE_ROW_CLASS}>
          <p className={EYEBROW_LABEL_CLASS}>Year worked on</p>

          <time dateTime={String(year)} className={RAIL_VALUE_CLASS}>
            {year}
          </time>
        </div>

        {technologies?.length > 0 && (
          <div className={ARTICLE_ROW_CLASS}>
            <p className={EYEBROW_LABEL_CLASS}>Technologies</p>

            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {technologies.map((technology) => (
                <li key={technology} className={TECH_ITEM_CLASS}>
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        )}

        {idea?.length > 0 && (
          <ArticleParagraphs heading="The idea" paragraphs={idea} lead />
        )}

        <ArticleParagraphs heading="Work involved" paragraphs={work_involved} />
      </article>
    </PageSection>
  );
};

export default ProjectPage;
