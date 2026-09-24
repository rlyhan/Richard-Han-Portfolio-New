import { FEATURED_LABEL, FEATURED_PROJECTS } from "../../data/home.data";
import HomeProjectCard from "./HomeProjectCard";

export const GRID_BORDER_COLOR = "border-[#5D5D5D]";

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

// The right half of the hero.
//
// A definite height, not min-height: the grid divides whatever it is given between
// the twelve rows, so the cells only have proportions if the panel has a height. Below
// md that is a share of the viewport; from md up it is the row the hero's flex layout
// hands it. The overflow is the backstop for a viewport too short to divide.
//
// `setGridRef` hands the whole grid to the hero's exit as one plane — see Home.
const HomeWork = ({ setGridRef, onSelectProject }) => (
  <section
    aria-labelledby="home-featured"
    className="h-[50svh] shrink-0 overflow-hidden md:h-full"
  >
    <div
      ref={setGridRef}
      // The split widens the right column as the panel narrows, so the two
      // stacked cards keep a usable width when the hero is only 58% of a
      // mid-size screen.
      className="grid h-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] grid-rows-12 md:max-wide:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] wide:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]"
    >
      {/* First in the DOM so the cards read as its section, and placed into the
                bottom-left cell by the grid rather than by source order. */}
      <h2
        id="home-featured"
        // The right border matches the fill rather than GRID_BORDER_COLOR: that
        // edge sits against Touchgrass's dark card, not another grid line, so
        // the grid's usual border reads as a jarring dark seam. Matching it to
        // bg-sage makes it disappear instead.
        className={`col-start-1 row-start-8 row-end-13 wide:row-start-10 flex items-center justify-center border-r border-sage bg-sage p-3 font-outfit font-bold text-[1.4rem] leading-[1.05] text-moss md:p-[clamp(1rem,2vw,1.75rem)] md:text-[clamp(2rem,3.4vw,3.6rem)] md:leading-[1.02]`}
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
  </section>
);

export default HomeWork;
