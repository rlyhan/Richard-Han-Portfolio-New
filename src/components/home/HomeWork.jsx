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
// Only the lead cell changes with the viewport: from 1440px up the panel is wide enough
// that a row of it is shorter than it is wide, so the cell takes a ninth row and the
// sage block gives one up. The right column is an even six and six throughout.
const CELLS = [
  "col-start-1 row-start-1 row-end-8 wide:row-end-10",
  "col-start-2 row-start-1 row-end-7",
  "col-start-2 row-start-7 row-end-13",
];

// Shared by both layouts; each adds its own placement.
//
// The right border matches the fill rather than GRID_BORDER_COLOR: that edge sits
// against a project's dark card, not another grid line, so the grid's usual border
// reads as a jarring dark seam. Matching it to bg-sage makes it disappear instead.
const LABEL_CLASS =
  "flex items-center justify-center border-r border-sage bg-sage p-3 font-outfit font-medium text-[1.4rem] leading-[1.05] text-moss md:p-[clamp(1rem,2vw,1.75rem)] md:text-[clamp(2rem,3.4vw,3.6rem)] md:leading-[1.02]";

// The masonry spread: three hand-placed cells and the label taking what's left of
// the left column.
//
// The label is first in the DOM so the cards read as its section, and lands in the
// bottom-left cell by its placement rather than by source order.
const WorkGrid = ({ onSelectProject }) => (
  <div
    // The split widens the right column as the panel narrows, so the two
    // stacked cards keep a usable width when the hero is only 58% of a
    // mid-size screen.
    className="grid h-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] grid-rows-12 md:max-wide:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] wide:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]"
  >
    <h2
      id="home-featured"
      className={`col-start-1 row-start-8 row-end-13 wide:row-start-10 ${LABEL_CLASS}`}
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
