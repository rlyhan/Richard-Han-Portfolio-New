// The site's small-caps label voice, shared verbatim by the band heading, the
// byline, and every write-up's facts rail. Not the same constant as the two
// EYEBROW_CLASS variants in HomeWork.jsx/ProjectTile.jsx — those are tuned
// per context (tracking, size) and diverge from this on purpose.
export const EYEBROW_LABEL_CLASS =
  "font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase";

// The body-copy voice under a heading or byline. Callers add their own margin
// and max-width, and font-epilogue where the page hasn't already set it.
export const NOTE_TEXT_CLASS = "text-[0.8125rem] leading-[1.65] text-ash";

// The link wrapping a project's shot, in both the hero's cards and the
// Projects grid's tiles.
export const PROJECT_LINK_CLASS =
  "group block h-full focus-visible:outline-chalk focus-visible:-outline-offset-4";

// The empty well shown in place of a shot a project doesn't have.
export const IMAGE_FALLBACK_CLASS =
  "h-full w-full border border-grid bg-shell";
