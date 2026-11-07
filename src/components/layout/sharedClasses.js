// The site's small-caps label voice, shared verbatim by the band heading and every
// write-up's row labels. Not the same constant as EYEBROW_CLASS in ProjectTile.jsx —
// that one is tuned to its context (tracking, size) and diverges from this on purpose.
export const EYEBROW_LABEL_CLASS =
  "font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase";

// The page's furniture: the byline above a heading and the hero's copyright under it.
export const BYLINE_TEXT_CLASS =
  "font-arial text-[0.625rem] leading-[1.25] tracking-[0.06em] text-ash uppercase md:text-[0.6875rem]";

// The Projects masthead's title, in the homepage blocks' Arial.
export const PAGE_TITLE_CLASS =
  "font-arial text-[clamp(2.5rem,10vw,3.25rem)] leading-none tracking-[-0.025em] md:text-[clamp(2.75rem,4.4vw,4.5rem)]";

// Every page's side gutter.
export const PAGE_GUTTER_CLASS =
  "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

// About's two columns from md: the portrait and the bio in its opening, and each
// band's label and content below, so the two line up down the page.
export const ABOUT_COLUMNS_CLASS =
  "md:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]";

// The display size About's section labels and its title share, so the title on
// the portrait reads as the first of the labels down the page.
export const BAND_LABEL_CLASS =
  "text-[2.75rem] leading-[0.95] tracking-[-0.035em] md:text-[clamp(3rem,6vw,6.5rem)]";

// One row of a write-up: its label beside its content from lg, above it below.
export const ARTICLE_ROW_CLASS =
  "grid gap-3.5 border-t border-grid py-6 first:border-t-0 first:pt-0 last:pb-0 md:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-x-10";

// The body-copy voice under a heading or byline. Callers add their own margin
// and max-width.
export const NOTE_TEXT_CLASS =
  "font-arial text-[0.9375rem] leading-[1.6] font-medium text-ash";

// The link wrapping each shot in the hero's ticker.
export const PROJECT_LINK_CLASS =
  "group block h-full focus-visible:outline-chalk focus-visible:-outline-offset-4";

// The empty well shown in place of a shot a project doesn't have.
export const IMAGE_FALLBACK_CLASS = "h-full w-full border border-grid bg-shell";
