const NavMenu = ({ items, setNameRef, setNavRef }) => (
  <nav
    aria-label="Portfolio sections"
    className="relative z-10 grid min-h-[4rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-grid bg-shell px-[1.4rem] py-2 md:min-h-[9.75rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:py-4"
  >
    <p
      ref={setNameRef}
      className="font-heading text-[1.5rem] leading-none text-ink md:py-[0.12em] md:text-[clamp(3.75rem,6vw,4.5rem)] md:leading-[0.85]"
    >
      Richard&nbsp; <br />
      Han.
    </p>

    <div
      ref={setNavRef}
      className="flex flex-row justify-end gap-[0.7rem] md:flex-col md:items-end md:gap-0 md:pb-[0.3rem]"
    >
      {items.map(({ id, label, onSelect }, i) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onSelect}
          className="flex -mx-[0.35rem] min-h-12 items-center px-[0.35rem] font-urbanist text-[0.7rem] leading-[0.9] font-semibold whitespace-nowrap text-ink transition-colors hover:text-ash focus-visible:outline-ink md:mx-0 md:grid md:min-h-0 md:grid-cols-[1.6rem_minmax(0,1fr)] md:items-baseline md:px-0 md:text-[clamp(1.15rem,1.6vw,1.5rem)] md:leading-[1.55]"
        >
          <span
            aria-hidden="true"
            className="hidden font-epilogue text-[0.5625rem] tracking-[0.12em] text-ash md:block"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{label}.</span>
        </a>
      ))}
    </div>
  </nav>
);

export default NavMenu;
