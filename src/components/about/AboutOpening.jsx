import cn from "classnames";
import Byline from "../layout/Byline";
import { ABOUT_BIO, ABOUT_HEADING } from "../../data/about.data";
import { PORTRAIT } from "../../data/photos.data";

// The gutter the pages that band to the viewport edge carry. Stated here rather than
// taken from ContactPage, which owns the same line: the two pages share a shape,
// not a module, and this one is not allowed to change when that one does.
const GUTTER_CLASS = "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

// The Contact page's opening carrying this page's copy, so two pages opening
// the same way read as one site. What differs is the nav: Contact draws its own
// bar in the flow below this, where here the bar is pinned over the page.
//
// The title is one element sharing the picture's grid cell on a phone and
// taking its own cell beside it from md, rather than one heading per
// breakpoint — two would be two h1s and one id.
const AboutOpening = () => (
  <div className="grid min-h-[calc(100svh-var(--nav-height,4rem))] grid-rows-[auto_auto_minmax(0,1fr)] md:grid-cols-[minmax(0,45%)_minmax(0,55%)] md:grid-rows-[4rem_auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
    <div
      className={cn(
        "row-start-1 grid items-center border-b border-grid py-3 md:col-start-2 md:row-start-1 md:py-0",
        GUTTER_CLASS,
      )}
    >
      <Byline />
    </div>

    <figure className="relative col-start-1 row-start-2 h-[50svh] w-full overflow-hidden bg-shell md:col-start-1 md:row-span-3 md:row-start-1 md:h-auto">
      <img
        src={PORTRAIT.src}
        alt={PORTRAIT.alt}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[46%_center] grayscale"
      />

      <div aria-hidden="true" className="absolute inset-0 bg-scrim md:hidden" />
    </figure>

    <h1
      id="about-heading"
      className={cn(
        "relative col-start-1 row-start-2 self-end pb-5 font-urbanist text-[clamp(2.125rem,9vw,3rem)] leading-[0.98] font-medium text-cream md:col-start-2 md:row-start-2 md:self-auto md:pt-6 md:pb-6 md:text-[clamp(1.75rem,3.6vw,2.5rem)] md:text-ink lg:text-[clamp(2.5rem,4.2vw,3.75rem)]",
        GUTTER_CLASS,
      )}
    >
      {ABOUT_HEADING}
    </h1>

    <section
      aria-labelledby="about-heading"
      className={cn(
        "row-start-3 flex flex-col justify-center gap-4 py-5 md:col-start-2 md:row-start-3 md:pt-0 md:pb-7 lg:pb-9",
        GUTTER_CLASS,
      )}
    >
      <div className="grid max-w-[32rem] gap-4 text-[0.9375rem] leading-[1.65] text-ink md:text-base">
        {ABOUT_BIO.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  </div>
);

export default AboutOpening;
