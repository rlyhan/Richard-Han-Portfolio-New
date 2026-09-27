const AboutSection = ({ id, index, label, children }) => (
  <section
    aria-labelledby={`${id}-heading`}
    className="grid grid-cols-1 gap-6 border-t border-grid px-[1.4rem] pt-[2.125rem] pb-[2.625rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-[2.625rem] md:pb-[3.25rem] lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:gap-x-10 lg:gap-y-5"
  >
    <h2
      id={`${id}-heading`}
      className="font-epilogue text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase"
    >
      <small aria-hidden="true" className="mr-2.5 text-[0.5625rem]">
        {index}
      </small>
      {label}
    </h2>

    <div className="min-w-0">{children}</div>
  </section>
);

export default AboutSection;
