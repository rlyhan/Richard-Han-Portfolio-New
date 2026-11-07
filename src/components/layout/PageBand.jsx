import cn from "classnames";
import {
  ABOUT_COLUMNS_CLASS,
  PAGE_GUTTER_CLASS,
  BAND_LABEL_CLASS,
} from "./sharedClasses";

// Each half of a band carries the page's gutter and the band's vertical padding
// itself, so the tone fills its half edge to edge.
const BAND_HALF_CLASS = cn(
  "pt-[2.125rem] pb-[2.625rem] md:pt-[2.625rem] md:pb-[3.25rem]",
  PAGE_GUTTER_CLASS,
);

// A band splits on the opening's columns: the label on a homepage block's colour
// under the portrait, the content under the bio. `tone` is that block's ground and
// type, and `mobileTone` what the content takes on below md, where the halves stack
// and the whole band reads as the one block.
const PageBand = ({ id, index, label, tone, mobileTone, children }) => (
  <section
    aria-labelledby={`${id}-heading`}
    className={cn("grid grid-cols-1", ABOUT_COLUMNS_CLASS)}
  >
    <div className={cn(BAND_HALF_CLASS, tone)}>
      <h2
        id={`${id}-heading`}
        className="flex flex-col gap-3 font-arial tracking-[-0.025em] md:items-end md:gap-4 md:text-right"
      >
        {index && (
          <span
            aria-hidden="true"
            className="text-[1.75rem] leading-none opacity-60 md:text-[clamp(1.75rem,2.7vw,2.75rem)]"
          >
            {index}
          </span>
        )}
        <span className={BAND_LABEL_CLASS}>
          {label.split(" ").map((word) => (
            <span key={word} className="block">
              {word}{" "}
            </span>
          ))}
        </span>
      </h2>
    </div>

    <div
      className={cn(
        "min-w-0 border-grid bg-sheet text-ink md:[section:not(:first-of-type)>&]:border-t",
        BAND_HALF_CLASS,
        mobileTone,
      )}
    >
      {children}
    </div>
  </section>
);

export default PageBand;
