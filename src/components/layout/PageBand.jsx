import cn from "classnames";

// The chrome every band wears: the rule that opens it, the page's gutter, and its
// own vertical padding.
const BAND_CLASS =
  "border-t border-grid px-[1.4rem] pt-[2.125rem] pb-[2.625rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-[2.625rem] md:pb-[3.25rem]";

// The two registers a band is read in: the label down the left, the content beside it.
const BAND_COLUMNS_CLASS =
  "lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:gap-x-10 lg:gap-y-5";

// The split the content register takes when it has two columns of its own.
export const BAND_SPLIT_CLASS =
  "md:grid-cols-[minmax(0,36%)_minmax(0,64%)] md:gap-x-8";

const PageBand = ({ id, index, label, children }) => (
  <section
    aria-labelledby={`${id}-heading`}
    className={cn("grid grid-cols-1 gap-6", BAND_CLASS, BAND_COLUMNS_CLASS)}
  >
    <h2
      id={`${id}-heading`}
      className="font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase"
    >
      {index && (
        <small aria-hidden="true" className="mr-2.5 text-[0.5625rem]">
          {index}
        </small>
      )}
      {label}
    </h2>

    <div className="min-w-0">{children}</div>
  </section>
);

export default PageBand;
