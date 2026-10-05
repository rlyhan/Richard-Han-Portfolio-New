import { useMemo, useRef, useState } from "react";
import PageSection from "../components/layout/PageSection";
import PageMasthead from "../components/layout/PageMasthead";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectTile from "../components/projects/ProjectTile";
import { usePage } from "../routes/RouterContext";
import { useTabSelect } from "../hooks/useTabSelect";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSplitReveal } from "../hooks/useSplitReveal";
import PROJECTS, {
  PROJECTS_HEADING,
  PROJECTS_NOTE,
} from "../data/projects.data";

// `all` is not a category, which is why the predicate is per filter rather than a
// field read off the project: the list's own flag is `client`, and "personal" is the
// absence of it rather than a value of its own.
const FILTERS = [
  { id: "all", label: "All", matches: () => true },
  { id: "client", label: "Client", matches: (project) => project.client },
  { id: "personal", label: "Personal", matches: (project) => !project.client },
];

// How many shots load with the page rather than when the reader reaches them.
//
// One: it's all that's on screen at every width, and the largest thing this page
// paints. The two beside it on a desktop grid are named in index.html instead —
// earlier than any hint here can be — and on a phone they're below the fold,
// where this would fetch them at high priority for nothing.
//
// The rows further down need no hint either: they're revealed on the scroll, and
// that reveal waits for its own shots (see useScrollReveal) — a wait there's
// nothing to see during.
const EAGER_TILES = 1;

// The number beside each title, worked out once off the full list. The filters hide
// tiles rather than renumbering them, so a project keeps its number whichever filter
// is up — see ProjectTile.
const NUMBERED_PROJECTS = PROJECTS.map((project, i) => ({
  project,
  number: i + 1,
}));

// The Projects page: a masthead, a rule carrying the filters and the count, and the
// whole list as a grid of framed shots.
//
// Every project, not a featured subset — the count on the rule is the point of
// the page ("14 / 14"), and a list that silently left three out couldn't state it.
//
// A tile is the link to that project's write-up, at /projects/<id> — see ProjectPage,
// and routes, which builds a record per project off the same list this page lists.
//
// It ends where its last tile does. Only the homepage hands over on the scroll — see
// RouterProvider — so the foot of this page is the foot of the document, and the way
// on from here is the nav bar pinned across it.
//
// Unlike About, this page needs no stacking context of its own, since it
// arrives by a swap rather than sharing a document with a sticky hero.
const ProjectsPage = () => {
  const { isArriving } = usePage();

  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);

  const headingRef = useRef(null);
  useSplitReveal(headingRef, { enabled: !isArriving });

  const gridRef = useRef(null);

  // gridRef as the panel, since one grid serves all three filters: pressing a
  // filter swaps its contents without the element changing, so the fade over the
  // swap is replayed by hand — see useTabSelect for why it isn't a CSS animation.
  const { selectTab } = useTabSelect(activeFilter, setActiveFilter, {
    panelRef: gridRef,
  });

  // Keyed on the filter: re-filtering the grid leaves the rows the reveal measured
  // gone. Alongside the toolbar's fade, not instead of it — the fade covers the
  // swap, this carries in the tiles below the fold, and they compose since the
  // grid's opacity and a tile's multiply.
  //
  // Not while the page is still arriving: a swap holds it a screen below the fold
  // while it travels, and rows measured there are measured in the wrong place.
  useScrollReveal(gridRef, activeFilter, { enabled: !isArriving });

  const shown = useMemo(() => {
    const { matches } = FILTERS.find((filter) => filter.id === activeFilter);
    return NUMBERED_PROJECTS.filter((entry) => matches(entry.project));
  }, [activeFilter]);

  return (
    <PageSection
      id="projects"
      contained={false}
      additionalClasses="flex flex-col bg-cream font-epilogue text-ink"
    >
      <PageMasthead
        heading={PROJECTS_HEADING}
        note={PROJECTS_NOTE}
        headingRef={headingRef}
      />

      <section aria-label="Project list" className="border-t border-grid">
        <ProjectsToolbar
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelect={selectTab}
          shown={shown.length}
          total={NUMBERED_PROJECTS.length}
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {shown.map(({ project, number }, i) => (
            <ProjectTile
              key={project.id}
              project={project}
              number={number}
              eager={i < EAGER_TILES}
            />
          ))}
        </div>
      </section>
    </PageSection>
  );
};

export default ProjectsPage;
