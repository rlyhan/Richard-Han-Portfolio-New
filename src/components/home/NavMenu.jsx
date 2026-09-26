// The foot of the hero: the name block and the section links.
//
// Two elements rather than one, because the hero's exit sinks them on their own
// beats — `setNameRef` and `setNavRef` are how Home collects them.
//
// A <nav> inside the hero's <section> is scoped to it, so it doesn't compete with
// the page's own contentinfo landmark at the bottom of App.
//
// Real anchors, not buttons: each one is an in-page destination, so the href is the
// behaviour and the handler only upgrades the jump to the same scripted scroll the
// nav bar and the scroll cue use. Without JS the links still land.
const NavMenu = ({ items, setNameRef, setNavRef }) => (
  <nav
    aria-label="Portfolio sections"
    className="relative z-10 grid min-h-[2.8125rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-ink/10 bg-cream px-[1.1rem] py-2 md:min-h-[10.125rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:px-[clamp(1.5rem,3vw,3rem)] md:py-5"
  >
    <p
      ref={setNameRef}
      className="font-heading text-[1.5rem] leading-none md:pb-[0.12em] md:text-[clamp(3.75rem,7.1vw,7.5rem)] md:leading-[0.72]"
    >
      Richard&nbsp;
      <br className="inline" />
      Han.
    </p>

    <div
      ref={setNavRef}
      className="flex flex-row justify-end gap-[0.7rem] mt-auto md:mt-0 md:flex-col md:items-end md:gap-0 md:pb-[0.2rem]"
    >
      {items.map(({ id, label, onSelect }, i) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onSelect}
          className="block font-outfit text-[0.7rem] leading-[0.9] whitespace-nowrap text-ink transition-colors hover:text-moss focus-visible:outline-ink md:grid md:grid-cols-[2rem_minmax(0,1fr)] md:items-baseline md:text-[clamp(1.35rem,2.3vw,2.45rem)]"
        >
          <span
            aria-hidden="true"
            className="hidden font-sans text-[0.62rem] text-moss md:block"
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
