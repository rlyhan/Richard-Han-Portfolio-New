import PointList from "../layout/PointList";
import { WORK } from "../../data/work.data";

const AboutExperience = () => (
  <>
    {WORK.map(({ id, heading, subheading, listItems }) => (
      <article
        key={id}
        className="grid gap-4 border-t border-grid py-[1.625rem] first:border-t-0 first:pt-0"
      >
        <div>
          <h3 className="font-arial text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
            {heading}
          </h3>
          <p className="mt-2 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.02em] text-ash uppercase">
            {subheading}
          </p>
        </div>

        <div className="pr-6 md:pr-[clamp(2rem,10vw,10rem)]">
          <PointList points={listItems} />
        </div>
      </article>
    ))}
  </>
);

export default AboutExperience;
