import { FEATURED_LABEL, FEATURED_PROJECTS } from "../../data/home.data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HomeBlocks from "./HomeBlocks";
import HomeProjectCarousel from "./HomeProjectCarousel";
import { EYEBROW_LABEL_TYPE_CLASS } from "../layout/sharedClasses";

export const GRID_BORDER_COLOR = "border-grid";

// md, as Tailwind has it. The two layouts below are different markup rather than
// one layout restyled, so the breakpoint has to be readable from JS as well —
// see useMediaQuery.
const MD_UP = "(min-width: 768px)";

export const EYEBROW_CLASS =
  "font-epilogue font-medium uppercase leading-none tracking-[0.18em]";

// The phone layout: the heading holds one column, the projects pass through
// the other one card at a time — stacked, a third of a phone screen is too
// little height to show three cells and still have each shot read.
const WorkColumns = () => (
  <div className="grid h-full grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
    <h2
      className={`${EYEBROW_LABEL_TYPE_CLASS} flex items-center bg-slate p-3 text-chalk`}
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
      aria-label={isMdUp ? undefined : FEATURED_LABEL}
      className={`h-[35svh] min-h-[7.5rem] overflow-hidden border-t ${GRID_BORDER_COLOR} md:col-start-2 md:row-span-2 md:row-start-1 md:h-full md:min-h-0 md:border-t-0 md:border-l`}
    >
      <div ref={setGridRef} className="h-full">
        {isMdUp ? <HomeBlocks /> : <WorkColumns />}
      </div>
    </section>
  );
};

export default HomeWork;
