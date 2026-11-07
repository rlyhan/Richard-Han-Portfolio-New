import cn from "classnames";
import Byline from "../layout/Byline";
import SplitLine from "../common/SplitLine";
import { ABOUT_BIO, ABOUT_HEADING } from "../../data/about.data";
import { PORTRAIT } from "../../data/photos.data";
import {
  ABOUT_COLUMNS_CLASS,
  PAGE_GUTTER_CLASS,
  BAND_LABEL_CLASS,
} from "../layout/sharedClasses";

// The portrait's rendered width, for its srcset. Cropped to cover, so it follows
// the frame's height rather than its width: 50svh tall at the picture's 1.6:1 on a
// phone, and close to the full viewport height beside the copy from md.
const PORTRAIT_SIZES = "(min-width: 768px) 140vh, 80vh";

// The Contact page's opening carrying this page's copy, so two pages opening
// the same way read as one site. What differs is the nav: Contact draws its own
// bar in the flow below this, where here the bar is pinned over the page.
//
// The title sits on the foot of the portrait at every width: on a phone at its
// left, and from md at its right edge, level with the section labels below.
const AboutOpening = ({ headingRef }) => (
  <div
    className={cn(
      "grid min-h-[calc(100svh-var(--nav-height,4rem))] grid-rows-[auto_auto_minmax(0,1fr)] bg-sheet text-ink md:grid-rows-[4rem_minmax(0,1fr)]",
      ABOUT_COLUMNS_CLASS,
    )}
  >
    <div
      className={cn(
        "row-start-1 grid items-center py-3 md:col-start-2 md:row-start-1 md:py-0",
        PAGE_GUTTER_CLASS,
      )}
    >
      <Byline />
    </div>

    <figure className="relative col-start-1 row-start-2 h-[50svh] w-full overflow-hidden bg-shell md:col-start-1 md:row-span-2 md:row-start-1 md:h-auto">
      <img
        src={PORTRAIT.src}
        srcSet={PORTRAIT.srcSet}
        sizes={PORTRAIT_SIZES}
        alt={PORTRAIT.alt}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[46%_center] grayscale"
      />

      <div aria-hidden="true" className="absolute inset-0 bg-scrim" />
    </figure>

    <h1
      ref={headingRef}
      id="about-heading"
      className={cn(
        "relative col-start-1 row-start-2 self-end pb-5 font-arial text-chalk md:row-span-2 md:row-start-1 md:pb-[2.625rem] md:text-right",
        BAND_LABEL_CLASS,
        PAGE_GUTTER_CLASS,
      )}
    >
      <SplitLine text={ABOUT_HEADING} />
    </h1>

    <section
      aria-labelledby="about-heading"
      className={cn(
        "row-start-3 flex flex-col justify-center gap-4 border-grid pt-8 pb-5 md:col-start-2 md:row-start-2 md:border-b md:pt-6 md:pb-7 lg:pb-9",
        PAGE_GUTTER_CLASS,
      )}
    >
      <div className="grid max-w-[38rem] gap-4 pr-6 font-arial text-base leading-[1.55] text-ink md:pr-0 md:text-[clamp(1rem,1.1vw,1.1875rem)]">
        {ABOUT_BIO.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  </div>
);

export default AboutOpening;
