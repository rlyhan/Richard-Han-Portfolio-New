import cn from "classnames";
import PointList from "../layout/PointList";
import { BAND_SPLIT_CLASS } from "../layout/PageBand";
import { WORK } from "../../data/work.data";

const AboutExperience = () => (
  <>
    {WORK.map(({ id, heading, subheading, listItems }) => (
      <article
        key={id}
        className={cn(
          "grid grid-cols-1 gap-3.5 border-t border-grid py-[1.625rem] first:border-t-0 first:pt-0 md:gap-y-1.5",
          BAND_SPLIT_CLASS,
        )}
      >
        <div>
          <h3 className="font-urbanist text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] font-bold text-ink">
            {heading}
          </h3>
          <p className="mt-2 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.02em] text-ash uppercase">
            {subheading}
          </p>
        </div>

        <PointList points={listItems} />
      </article>
    ))}
  </>
);

export default AboutExperience;
