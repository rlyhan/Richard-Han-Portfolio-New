import cn from "classnames";
import IconRenderer from "../icons/IconRenderer";
import { EYEBROW_LABEL_CLASS } from "../layout/sharedClasses";
import {
  INTEREST_TAGS,
  INTEREST_TAGS_NOTE,
  INTERESTS,
} from "../../data/about.data";

const PLATE_CLASS =
  "border border-current/30 bg-black/10 text-ink md:dark:bg-white/15";

const AboutInterests = () => (
  <>
    {INTERESTS.map(({ id, icon, title, text }) => (
      <article
        key={id}
        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[1.125rem] border-t border-grid py-[1.375rem] first:border-t-0 first:pt-0"
      >
        <span
          className={cn(
            "inline-flex size-[2.375rem] shrink-0 items-center justify-center md:size-[2.625rem]",
            PLATE_CLASS,
          )}
        >
          <IconRenderer icon={icon} className="size-6" />
        </span>
        <div>
          <h3 className="font-arial text-[1.25rem] leading-[1.2] tracking-[-0.01em] text-ink">
            {title}
          </h3>
          <p className="mt-1.5 max-w-[36.25rem] pr-6 font-arial text-[0.9375rem] leading-[1.6] text-pretty text-ink md:pr-0 md:text-base">
            {text}
          </p>
        </div>
      </article>
    ))}

    <p className={cn("mt-1.5 mb-3", EYEBROW_LABEL_CLASS)}>
      {INTEREST_TAGS_NOTE}
    </p>

    <ul className="flex flex-wrap gap-2.5">
      {INTEREST_TAGS.map(({ id, icon, label }) => (
        <li
          key={id}
          className={cn(
            "inline-flex items-center gap-[0.5625rem] px-[0.9375rem] py-2.5 font-arial text-sm leading-none",
            PLATE_CLASS,
          )}
        >
          <IconRenderer icon={icon} className="size-4" />
          {label}
        </li>
      ))}
    </ul>
  </>
);

export default AboutInterests;
