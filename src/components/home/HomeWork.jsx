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
// column splits evenly. The old twelve-row track existed to give the label a row
// of its own; the label is now a header above the grid, so the rows only have the
// cards to describe and can say so directly.
const CELLS = [
  "col-start-1 row-start-1 row-end-3",
  "col-start-2 row-start-1 row-end-2",
  "col-start-2 row-start-2 row-end-3",
];

// The hero's small-caps voice: the section label, its counter, and each card's
// kicker all speak in it, so the panel reads as one system rather than three
// unrelated labels. Tracking is doing the work at this size — it's what makes a
// 0.7rem line read as a deliberate label instead of as shrunken body copy.
const EYEBROW_CLASS =
  "font-outfit font-medium uppercase leading-none tracking-[0.2em]";

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
  "flex items-center justify-start border-r border-sage bg-sage p-2.5 font-outfit font-medium text-[1.05rem] leading-[1.25] text-moss md:p-[clamp(0.75rem,1.2vw,1.25rem)] md:text-[clamp(1.2rem,1.7vw,1.85rem)] md:leading-[1.2]";

// The masonry spread: a section header over three hand-placed cells.
//
// The panel is inset rather than bled to the viewport edge. It used to run flush
// to the top and right of the screen while the intro panel beside it sat inside
// clamp(2rem,4vw,4.5rem) of padding, and the mismatch read as a card grid that had
// slipped its frame. The inset is smaller than the intro's — the spread wants the
// width — but it puts the same kind of air on all three outer edges and, at the
// bottom, keeps the cards off the nav bar they used to butt against.
//
// The label is a header rule spanning the full panel instead of a bordered chip
// stacked on the lead column: a rule introduces all three cards, where the chip
// only ever looked like a caption on the first one. The counter on the far right is
// the second half of that rule — it states the depth of the set, which is the one
// thing a three-card spread can't say for itself.
const WorkGrid = ({ onSelectProject }) => (
  <div className="flex h-full min-h-0 flex-col gap-[clamp(0.85rem,1.7vh,1.5rem)] pt-[clamp(1.5rem,3.2vh,2.75rem)] pr-[clamp(1.5rem,2.8vw,3.5rem)] pb-[clamp(1.5rem,3.2vh,2.75rem)]">
    <header
      className={`flex shrink-0 items-center justify-between gap-6 border-b ${GRID_BORDER_COLOR} pb-[clamp(0.55rem,1vh,0.9rem)]`}
    >
      <h2
        className={`${EYEBROW_CLASS} text-[0.68rem] text-cream/60 md:text-[clamp(0.68rem,0.78vw,0.82rem)]`}
      >
        {FEATURED_LABEL}
      </h2>

      {/* Decorative: the numbering it counts is already on each card, and read
          aloud on its own "01 — 03" is noise. */}
      <p
        aria-hidden="true"
        className={`${EYEBROW_CLASS} text-[0.68rem] text-cream/30 md:text-[clamp(0.68rem,0.78vw,0.82rem)]`}
      >
        01 — {String(FEATURED_PROJECTS.length).padStart(2, "0")}
      </p>
    </header>

    {/* The left column is the lead card's own width — see CELLS.
    
        47%, so the lead card and the two stacked ones come out near enough the
        same width and the spread reads as a composition rather than as one
        column that happened to win. It used to be a pair of caps that landed
        differently either side of the `wide` breakpoint — 41% of the panel at
        1280px against 48% at 1512px — which is why the split visibly jumped
        across it.
    
        The svh cap only bites on a short screen, and that is its whole job: the
        lead cell is as tall as the grid, so on a letterbox viewport a 47% column
        would be wider than it is tall and the 3:4 tablet shot inside it would
        crop down to a sliver. */}
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,min(44svh,47%))_minmax(0,1fr)] grid-rows-2 gap-x-[clamp(0.75rem,1.4vw,1.5rem)] gap-y-[clamp(0.75rem,1.9vh,1.5rem)]">
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

// The phone layout: the label holds one column and the projects pass through the
// other one card at a time. Two columns rather than the spread stacked, because a
// third of a phone screen is too little height to show three cells and still have
// each shot read.
//
// The label keeps the narrower column — it wraps, where a card can only crop.
const WorkColumns = ({ onSelectProject }) => (
  <div className="grid h-full grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] gap-2">
    <h2 className={LABEL_CLASS}>{FEATURED_LABEL}</h2>

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
// `setGridRef` hands the whole panel to the hero's exit as one plane — see Home. It
// sits on the wrapper rather than on either layout, so the exit doesn't care which
// one is mounted.
const HomeWork = ({ setGridRef, onSelectProject }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section
      aria-label={FEATURED_LABEL}
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
