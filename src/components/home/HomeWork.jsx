import HomeBlocks from "./HomeBlocks";

// The right half of the hero, and below md what sits under the intro.
//
// `setGridRef` hands the whole panel to the hero's exit as one plane — see Home.
const HomeWork = ({ setGridRef, cue }) => (
  <section
    className="relative border-grid md:col-start-2 md:row-span-2 md:row-start-1 md:h-full md:min-h-0 md:overflow-hidden md:border-l"
  >
    {cue && (
      <div className="absolute right-[1.4rem] bottom-full mb-3">{cue}</div>
    )}

    <div ref={setGridRef} className="h-full">
      <HomeBlocks />
    </div>
  </section>
);

export default HomeWork;
