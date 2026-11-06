// The site's small-caps label voice, shared verbatim by the band heading and every
// write-up's row labels. Not the same constant as EYEBROW_CLASS in ProjectTile.jsx —
// that one is tuned to its context (tracking, size) and diverges from this on purpose.
export const EYEBROW_LABEL_CLASS =
  "font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase";

// One row of a write-up: its label beside its content from lg, above it below.
export const ARTICLE_ROW_CLASS =
  "grid gap-3.5 border-t border-grid py-6 first:border-t-0 first:pt-0 last:pb-0 md:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-x-10";

// The body-copy voice under a heading or byline. Callers add their own margin
// and max-width.
export const NOTE_TEXT_CLASS =
  "font-arial text-[0.9375rem] leading-[1.6] font-medium text-ash";

// The link wrapping a project's shot: the hero's ticker and the Projects grid's
// tiles.
export const PROJECT_LINK_CLASS =
  "group block h-full focus-visible:outline-chalk focus-visible:-outline-offset-4";

// The caption plate over a project's shot, its foot-right corner cut at 45° by
// however much the caller sets `--plate-cut` to. A real border would stop at the
// cut, since clip-path takes it off with the corner, so the plate's own ground is
// the edge and a copy of its shape, a pixel in, is the fill.
export const PLATE_CLASS =
  "isolate bg-plate-edge [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_var(--plate-cut)),calc(100%_-_var(--plate-cut))_100%,0_100%)] before:absolute before:inset-px before:-z-10 before:bg-plate before:[clip-path:inherit]";

export const PLATE_TITLE_CLASS =
  "font-arial truncate font-bold tracking-[-0.01em] text-ink";

export const PLATE_ARROW_CLASS =
  "col-start-3 row-span-2 row-start-1 grid shrink-0 place-items-center self-center text-ash transition-[transform,color] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink motion-reduce:transition-none";

// The empty well shown in place of a shot a project doesn't have.
export const IMAGE_FALLBACK_CLASS = "h-full w-full border border-grid bg-shell";
