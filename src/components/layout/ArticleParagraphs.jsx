const ArticleParagraphs = ({ heading, paragraphs }) => (
  <div className="flex flex-col gap-4 md:gap-8">
    <h2 className="font-urbanist text-xl leading-[1.1] font-bold text-ink md:text-4xl">
      {heading}
    </h2>

    <div className="grid gap-4 md:pr-16 lg:pr-24">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="font-epilogue text-[0.9375rem] leading-[1.7] text-ink"
        >
          {paragraph}
        </p>
      ))}
    </div>
  </div>
);

export default ArticleParagraphs;
