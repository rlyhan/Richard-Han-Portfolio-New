import IconRenderer from "../icons/IconRenderer";
import {
  INTEREST_TAGS,
  INTEREST_TAGS_NOTE,
  INTERESTS,
} from "../../data/about.data";

const AboutInterests = () => (
  <>
    {INTERESTS.map(({ id, icon, title, text }) => (
      <article
        key={id}
        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[1.125rem] border-t border-grid py-[1.375rem] first:border-t-0 first:pt-0"
      >
        <span className="inline-flex size-[2.375rem] shrink-0 items-center justify-center border border-grid bg-shell text-ink md:size-[2.625rem]">
          <IconRenderer icon={icon} className="size-6" />
        </span>
        <div>
          <h3 className="font-urbanist text-[1.125rem] leading-[1.2] font-bold text-ink">
            {title}
          </h3>
          <p className="mt-1.5 max-w-[36.25rem] text-[0.8125rem] leading-[1.65] text-ash">
            {text}
          </p>
        </div>
      </article>
    ))}

    <p className="mt-1.5 mb-3 font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase">
      {INTEREST_TAGS_NOTE}
    </p>

    <ul className="flex flex-wrap gap-2.5">
      {INTEREST_TAGS.map(({ id, icon, label }) => (
        <li
          key={id}
          className="inline-flex items-center gap-[0.5625rem] border border-grid bg-shell px-[0.9375rem] py-2.5 font-urbanist text-sm leading-none font-semibold text-ink"
        >
          <IconRenderer icon={icon} className="size-4 text-ash" />
          {label}
        </li>
      ))}
    </ul>
  </>
);

export default AboutInterests;
