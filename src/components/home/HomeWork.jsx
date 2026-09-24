import { FEATURED_LABEL, FEATURED_PROJECTS } from "../../data/home.data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HomeProjectCard from "./HomeProjectCard";
import HomeProjectCarousel from "./HomeProjectCarousel";

export const GRID_BORDER_COLOR = "border-[#5D5D5D]";

// md, as Tailwind has it. The two layouts below are different markup rather than
// one layout restyled, so the breakpoint has to be readable from JS as well —
// see useMediaQuery.
const MD_UP = "(min-width: 768px)";

// Where each cell sits in the twelve-row grid. Hand-placed rather than flowed: the
// spread is the point, and an auto-placed fourth card would break it — which is why
// FEATURED_PROJECTS is fixed at three.
//
// Fixed at every width now, including from 1440px up, where the lead cell used to take
// a ninth row and the sage block give one up. The left column's WIDTH carries that job
// instead — see the grid below — which keeps the lead card's portrait shot filling its
// cell without costing the sage block the rows it needs to stay square. The right
// column is an even six and six throughout.
const CELLS = [
  "col-start-1 row-start-1 row-end-8",
  "col-start-2 row-start-1 row-end-7",
  "col-start-2 row-start-7 row-end-13",
];

// Shared by both layouts; each adds its own placement.
//
// Sized as a label rather than as a second heading: the hero already has two voices
// competing for the eye — the display lines at up to 6.1vw and the name and section
// links in the bar below — and at the 3.4vw this used to carry, a two-word caption on
// a pale block was louder than both. It now tops out at 1.45vw, comfortably under the
// nav links' 3.1vw, so the sage block reads as a field with a label on it. Padding
// came down with it: at this size the block's proportions come from its cell, not
// from the gap around the words.
//
// Leading opens up to match — 1.02 is display leading, and it sets tight two-line
// copy that reads as a heading however small the type is.
//
// The right border matches the fill rather than GRID_BORDER_COLOR: that edge sits
// against a project's dark card, not another grid line, so the grid's usual border
// reads as a jarring dark seam. Matching it to bg-sage makes it disappear instead.
const LABEL_CLASS =
  "flex items-center justify-center border-r border-sage bg-sage p-2.5 font-outfit font-medium text-[0.85rem] leading-[1.25] text-moss md:p-[clamp(0.75rem,1.2vw,1.25rem)] md:text-[clamp(1rem,1.45vw,1.55rem)] md:leading-[1.2]";

// The masonry spread: three hand-placed cells and the label taking what's left of
// the left column.
//
// The label is first in the DOM so the cards read as its section, and lands in the
// bottom-left cell by its placement rather than by source order.
const WorkGrid = ({ onSelectProject }) => (
  <div
    // The left column is the sage block's width, so it's measured in height: the
    // block holds five of the twelve rows, and the panel runs at roughly 0.7 of
    // the viewport once the nav bar has taken its share, which puts a square at
    // about 30svh a side. Capped by a share of the panel so the column can never
    // outgrow it — the cap is what a tall viewport gets, and it's the split this
    // grid has always used. A wide, short viewport gets the height instead, which
    // is what keeps the block square rather than letting it stretch into a band:
    // the taller the row, the wider the column, and the two stay in step.
    //
    // The cap widens the right column as the panel narrows, so the two stacked
    // cards keep a usable width when the hero is only 58% of a mid-size screen.
    className="grid h-full grid-cols-[minmax(0,min(30svh,41%))_minmax(0,1fr)] grid-rows-12 wide:grid-cols-[minmax(0,min(30svh,44%))_minmax(0,1fr)]"
  >
    <h2
      id="home-featured"
      className={`col-start-1 row-start-8 row-end-13 ${LABEL_CLASS}`}
    >
      {FEATURED_LABEL}
    </h2>

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
);

// The phone layout: the label holds one column and the projects pass through the
// other one card at a time. Two columns rather than the spread stacked, because a
// third of a phone screen is too little height to show three cells and still have
// each shot read.
//
// The label keeps the narrower column — it wraps, where a card can only crop.
const WorkColumns = ({ onSelectProject }) => (
  <div className="grid h-full grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
    <h2 id="home-featured" className={LABEL_CLASS}>
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
// between the twelve rows, so the cells only have proportions if the panel has a
// height. Below md that is a share of the viewport, and it's what gives the carousel
// its own; from md up it is the row the hero's flex layout hands it. The overflow is
// the backstop for a viewport too short to divide.
//
// `setGridRef` hands the whole panel to the hero's exit as one plane — see Home. It
// sits on the wrapper rather than on either layout, so the exit doesn't care which
// one is mounted.
const HomeWork = ({ setGridRef, onSelectProject }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section
      aria-labelledby="home-featured"
      className="h-[35svh] shrink-0 overflow-hidden md:h-full"
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
