import PageSection from "../components/layout/PageSection";
import PageBand from "../components/layout/PageBand";
import PointList from "../components/layout/PointList";
import ProjectMasthead from "../components/projects/ProjectMasthead";
import { usePage } from "../routes/RouterContext";
import { projectPathOf, projectSectionId } from "../routes/routes";
import PROJECTS from "../data/projects.data";

// One project's write-up, at /projects/<id>.
//
// Which project it is comes off this page's own path rather than from a prop: the
// outlet mounts a page with none — see PageOutlet. Its own, not the site's, because a
// swap carries this page in while the site is still at the Projects page behind it.
// The route table builds these paths off the same list this reads, so a path the
// router resolved always names a project here.
//
// Every write-up shares this one chunk, which is why the page is the component and the
// project is data: a chunk each would be fetched on the click that opened it, where
// this one is in hand from the first tile the viewer hovers.
//
// contained: false — the bands run their rules to the viewport edge, so the page
// frame's max width and gutter would cut each one short. The masthead, the shot and
// each band state the hero's gutter instead.
//
// The shot is matted on the vignetted well the Projects page frames its tiles on — see
// ProjectTile — inset nearly evenly rather than with that page's deep foot, which is
// room a tile leaves for its caption plate and a write-up has spent on the masthead.
const ProjectPage = () => {
  const { path } = usePage();

  const project = PROJECTS.find(({ id }) => projectPathOf(id) === path);
  const { id, name, images, work_involved } = project;
  const image = images?.[0];

  return (
    <PageSection
      id={projectSectionId(id)}
      contained={false}
      additionalClasses="flex flex-col bg-cream font-epilogue text-ink"
    >
      <ProjectMasthead project={project} />

      <figure className="px-[1.4rem] pb-[2.625rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pb-[3.25rem]">
        <div className="relative h-[23.75rem] overflow-hidden bg-frame md:h-[clamp(21.25rem,52vw,40rem)]">
          <div className="absolute top-3.5 right-5 bottom-6 left-5 flex items-center justify-center overflow-hidden md:top-5 md:right-[2.125rem] md:bottom-[2.125rem] md:left-[2.125rem]">
            {image ? (
              <img
                src={`/images/projects/${image}`}
                alt={`The ${name} site`}
                decoding="async"
                className="block h-full w-full object-contain object-center"
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full border border-grid bg-shell"
              />
            )}
          </div>
        </div>
      </figure>

      <PageBand id="work-involved" label="Work involved">
        <PointList points={work_involved} />
      </PageBand>
    </PageSection>
  );
};

export default ProjectPage;
