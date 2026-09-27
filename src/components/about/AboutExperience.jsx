import { WORK } from "../../data/work.data";

const AboutExperience = () => (
  <>
    {WORK.map(({ id, heading, subheading, listItems }) => (
      <article
        key={id}
        className="grid grid-cols-1 gap-3.5 border-t border-grid py-[1.625rem] first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,36%)_minmax(0,64%)] md:gap-x-8 md:gap-y-1.5"
      >
        <div>
          <h3 className="font-urbanist text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] font-bold text-ink">
            {heading}
          </h3>
          <p className="mt-2 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.02em] text-ash uppercase">
            {subheading}
          </p>
        </div>

        <ul className="grid gap-2.5">
          {listItems.map((point) => (
            <li
              key={point}
              className="relative pl-[1.125rem] text-[0.84375rem] leading-[1.6] before:absolute before:top-[0.68em] before:left-0 before:h-px before:w-2 before:bg-ash before:content-['']"
            >
              {point}
            </li>
          ))}
        </ul>
      </article>
    ))}
  </>
);

export default AboutExperience;
