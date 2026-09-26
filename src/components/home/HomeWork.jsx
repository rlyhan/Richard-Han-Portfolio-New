import { FEATURED_LABEL, FEATURED_PROJECTS } from "../../data/home.data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HomeProjectCard from "./HomeProjectCard";
import HomeProjectCarousel from "./HomeProjectCarousel";

export const GRID_BORDER_COLOR = "border-grid";

// md, as Tailwind has it. The two layouts below are different markup rather than
// one layout restyled, so the breakpoint has to be readable from JS as well —
// see useMediaQuery.
const MD_UP = "(min-width: 768px)";

// Where each cell sits. Hand-placed rather than flowed: the spread is the point,
// and an auto-placed fourth card would break it — which is why FEATURED_PROJECTS
// is fixed at three.
//
// Two rows, not twelve: the lead card takes the whole left column and the right
// column splits evenly.
const CELLS = [
  "col-start-1 row-start-1 row-end-3",
  "col-start-2 row-start-1 row-end-2",
  "col-start-2 row-start-2 row-end-3",
];

// The hero's small-caps voice: the counter beside the heading, and each card's
// number and category. Tracking is doing the work at this size — it's what makes a
// 11px line read as a deliberate label instead of as shrunken body copy.
export const EYEBROW_CLASS =
  "font-epilogue font-medium uppercase leading-none tracking-[0.18em]";

// The heading of either layout. The display face at its heaviest loaded weight
// and a size that stays a label: it names the panel against the display type
// opposite without becoming a second headline.
const HEADING_CLASS = "font-urbanist text-base leading-none font-bold text-ink";

// The masonry spread: a heading rule over three cells drawn as one grid.
//
// The panel runs to the edges of its half rather than sitting inside an inset. The
// hairlines are what hold it: one rule under the heading, one grid the cards share
// seams in, and a caption plate framed inside each cell. Nothing floats, so nothing
// needs air around it to look placed — and the shots get the width back.
//
// A fixed row for the heading rather than a share of the panel: it's a line of
// label type, and the rest of the height belongs to the cards.
//
// The counter on the far right is the second half of that rule — it states the
// depth of the set, which is the one thing a three-card spread can't say for
// itself.
const WorkGrid = ({ onSelectProject }) => (
  <div className="grid h-full min-h-0 grid-rows-[3.375rem_minmax(0,1fr)]">
    <header className="flex items-center justify-between gap-6 px-[clamp(1rem,1.6vw,1.75rem)]">
      <h2 className={HEADING_CLASS}>{FEATURED_LABEL}</h2>

      {/* Decorative: the numbering it counts is already on each card, and read
          aloud on its own "01 — 03" is noise. */}
      <p
        aria-hidden="true"
        className={`${EYEBROW_CLASS} text-[0.6875rem] text-ash`}
      >
        01 — {String(FEATURED_PROJECTS.length).padStart(2, "0")}
      </p>
    </header>

    {/* The left column is the lead card's own width — see CELLS. 1.05fr against
        1fr, so the lead reads as the wider of the two without the split looking
        like a ratio anyone chose.

        No gaps: the cards draw a grid rather than sitting in one, so a cell's
        right and bottom edges are its neighbour's left and top. The container
        supplies the two edges no cell owns. */}
    <div
      className={`grid min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] grid-rows-2 border-t ${GRID_BORDER_COLOR}`}
    >
      {FEATURED_PROJECTS.map((project, i) => (
        <HomeProjectCard
          key={project.id}
          project={project}
          index={i}
          position={CELLS[i]}
          eager={i === 0}
          onSelect={onSelectProject}
        />
      ))}
    </div>
  </div>
);

// The phone layout: the heading holds one column and the projects pass through the
// other one card at a time. Two columns rather than the spread stacked, because a
// third of a phone screen is too little height to show three cells and still have
// each shot read.
//
// The heading keeps the narrower column — it wraps, where a card can only crop —
// and sits on `shell` so the pair reads as a label beside a frame rather than as
// two cells of the same kind.
const WorkColumns = ({ onSelectProject }) => (
  <div className="grid h-full grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
    <h2
      className={`${HEADING_CLASS} flex items-center border-r ${GRID_BORDER_COLOR} bg-shell p-3 leading-tight`}
    >
      {FEATURED_LABEL}
    </h2>

    <HomeProjectCarousel
      projects={FEATURED_PROJECTS}
      onSelectProject={onSelectProject}
    />
  </div>
);

// The right half of the hero.
//
// A definite height, not min-height: from md up the grid divides whatever it is given
// between its rows, so the cells only have proportions if the panel has a height.
// Below md that is a share of the viewport, and it's what gives the carousel its own;
// from md up it is the row the hero's flex layout hands it. The overflow is the
// backstop for a viewport too short to divide.
//
// The seam moves with the layout: below md the panel sits under the intro and the
// line goes across the top of it, from md up it sits beside it and the line stands
// between the two halves.
//
// `setGridRef` hands the whole panel to the hero's exit as one plane — see Home. It
// sits on the wrapper rather than on either layout, so the exit doesn't care which
// one is mounted.
const HomeWork = ({ setGridRef, onSelectProject }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section
      aria-label={FEATURED_LABEL}
      className={`h-[35svh] shrink-0 overflow-hidden border-t ${GRID_BORDER_COLOR} md:h-full md:border-t-0 md:border-l`}
    >
      <div ref={setGridRef} className="h-full">
        {isMdUp ? (
          <WorkGrid onSelectProject={onSelectProject} />
        ) : (
          <WorkColumns onSelectProject={onSelectProject} />
        )}
      </div>
    </section>
  );
};

export default HomeWork;
