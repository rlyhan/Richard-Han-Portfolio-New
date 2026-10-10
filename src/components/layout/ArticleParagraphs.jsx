import cn from "classnames";

const LEAD_TEXT_CLASS =
  "max-w-[52ch] font-urbanist text-xl leading-[1.35] font-medium tracking-[-0.01em] text-ink md:text-[1.75rem]";

const BODY_TEXT_CLASS =
  "max-w-[62ch] font-epilogue text-[0.9375rem] leading-[1.75] font-normal text-ink md:text-lg";

const ArticleParagraphs = ({ heading, paragraphs, lead = false }) => (
  <div className="flex flex-col gap-4 md:gap-8">
    <h2 className="font-urbanist text-xl leading-[1.1] font-bold text-ink md:text-4xl">
      {heading}
    </h2>

    {paragraphs?.length > 0 && (
      <div className={cn("grid", lead ? "gap-5" : "gap-4")}>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={lead ? LEAD_TEXT_CLASS : BODY_TEXT_CLASS}
          >
            {paragraph}
          </p>
        ))}
      </div>
    )}
  </div>
);

export default ArticleParagraphs;
