import { FEATURED_LABEL, FEATURED_PROJECTS } from "../../data/home.data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HomeProjectCard from "./HomeProjectCard";
import HomeProjectCarousel from "./HomeProjectCarousel";

export const GRID_BORDER_COLOR = "border-grid";

// md, as Tailwind has it. The two layouts below are different markup rather than
// one layout restyled, so the breakpoint has to be readable from JS as well —
// see useMediaQuery.
const MD_UP = "(min-width: 768px)";

// Where each cell sits. Hand-placed, not flowed: the spread is the point, and an
// auto-placed fourth card would break it — why FEATURED_PROJECTS is fixed at
// three.
const CELLS = [
  "col-start-1 row-start-1 row-end-3",
  "col-start-2 row-start-1 row-end-2",
  "col-start-2 row-start-2 row-end-3",
];

export const EYEBROW_CLASS =
  "font-epilogue font-medium uppercase leading-none tracking-[0.18em]";

const HEADING_CLASS = "font-urbanist text-base leading-none font-bold text-ink";

// The masonry spread: a heading rule over three cells drawn as one grid.
//
// The counter beside the heading states the depth of the set, which a
// three-card spread can't say for itself — and is aria-hidden, since the
// numbering it counts is already on each card, where read aloud it's noise.
const WorkGrid = () => (
  <div className="grid h-full min-h-0 grid-rows-[3.375rem_minmax(0,1fr)]">
    <header className="flex items-center justify-between gap-6 px-[clamp(1rem,1.6vw,1.75rem)]">
      <h2 className={HEADING_CLASS}>{FEATURED_LABEL}</h2>

      <p
        aria-hidden="true"
        className={`${EYEBROW_CLASS} text-[0.6875rem] text-ash`}
      >
        01 — {String(FEATURED_PROJECTS.length).padStart(2, "0")}
      </p>
    </header>

    <div
      className={`grid min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] grid-rows-2 border-t ${GRID_BORDER_COLOR}`}
    >
      {FEATURED_PROJECTS.map((project, i) => (
        <HomeProjectCard
          key={project.id}
          project={project}
          index={i}
          position={CELLS[i]}
        />
      ))}
    </div>
  </div>
);

// The phone layout: the heading holds one column, the projects pass through
// the other one card at a time — stacked, a third of a phone screen is too
// little height to show three cells and still have each shot read.
const WorkColumns = () => (
  <div className="grid h-full grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
    <h2
      className={`${HEADING_CLASS} flex items-center border-r ${GRID_BORDER_COLOR} bg-shell p-3 leading-tight`}
    >
      {FEATURED_LABEL}
    </h2>

    <HomeProjectCarousel projects={FEATURED_PROJECTS} />
  </div>
);

// The right half of the hero.
//
// `setGridRef` hands the whole panel to the hero's exit as one plane — see
// Home. It sits on the wrapper rather than on either layout, so the exit
// doesn't care which one is mounted.
const HomeWork = ({ setGridRef }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section
      aria-label={FEATURED_LABEL}
      className={`h-[35svh] min-h-[7.5rem] overflow-hidden border-t ${GRID_BORDER_COLOR} md:h-full md:min-h-0 md:border-t-0 md:border-l`}
    >
      <div ref={setGridRef} className="h-full">
        {isMdUp ? <WorkGrid /> : <WorkColumns />}
      </div>
    </section>
  );
};

export default HomeWork;
