// The site's small-caps label voice, shared verbatim by the band heading, the
// byline, the hero's work heading, and every write-up's row labels. Not the same
// constant as the two EYEBROW_CLASS variants in HomeWork.jsx/ProjectTile.jsx —
// those are tuned per context (tracking, size) and diverge from this on purpose.
//
// The type apart from its colour, for the one label set on a dark plate.
export const EYEBROW_LABEL_TYPE_CLASS =
  "font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] uppercase";

export const EYEBROW_LABEL_CLASS = `${EYEBROW_LABEL_TYPE_CLASS} text-ash`;

// One row of a write-up: its label beside its content from lg, above it below.
export const ARTICLE_ROW_CLASS =
  "grid gap-3.5 border-t border-grid py-6 first:border-t-0 first:pt-0 last:pb-0 md:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-x-10";

// The body-copy voice under a heading or byline. Callers add their own margin
// and max-width, and font-epilogue where the page hasn't already set it.
export const NOTE_TEXT_CLASS =
  "text-[0.9375rem] leading-[1.6] font-medium text-ash";

// The tiling both dot patterns share. Offset by just under half a tile, so the
// first dot sits most of a gap in from the top and left edges and the one before
// it falls just past them.
export const DOT_GRID_CLASS = "bg-size-[1.5rem_1.5rem] bg-[position:0.6rem_0.6rem]";

// The hero's ground: fog, dotted in dark.
export const DOTTED_GROUND_CLASS = `bg-fog bg-dots ${DOT_GRID_CLASS}`;

// The link wrapping a project's shot, in both the hero's cards and the
// Projects grid's tiles.
export const PROJECT_LINK_CLASS =
  "group block h-full focus-visible:outline-chalk focus-visible:-outline-offset-4";

// The empty well shown in place of a shot a project doesn't have.
export const IMAGE_FALLBACK_CLASS =
  "h-full w-full border border-grid bg-shell";
