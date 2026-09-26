// The foot of the hero: the name at display size and the section links.
//
// Its own field rather than a continuation of the spread above it — `shell` is a
// half-step off the hero's ground, which separates the two without a heavy rule
// under the cards. The hairline on top is the same line the spread's cells are
// drawn with.
//
// The name is the one piece of the hero that keeps the page's own heading face
// rather than the hero's display face — it is the same name the header carries,
// and it should read as the site's rather than as this page's.
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
//
// The centre of the bar is left empty at md and up: that's where the scroll cue
// lands, between the name and the links — see Home.
const NavMenu = ({ items, setNameRef, setNavRef }) => (
  <nav
    aria-label="Portfolio sections"
    className="relative z-10 grid min-h-[2.8125rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-grid bg-shell px-[1.4rem] py-2 md:min-h-[9.75rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:py-4"
  >
    <p
      ref={setNameRef}
      // 0.85, not the 0.67 the design sets: that leading is for a wide,
      // heavy grotesque, and this face is a tall condensed one whose
      // ascenders run to about 0.75em. Anything under 0.8 and the two
      // lines print through each other.
      className="font-heading text-[1.5rem] leading-none text-ink md:pb-[0.12em] md:text-[clamp(3.75rem,6vw,6rem)] md:leading-[0.85]"
    >
      Richard&nbsp;
      {/* The break belongs to the display setting from md up, where the name is
          two lines of 60px type stacked beside the links. On a phone the bar is
          one 45px row and the name stays on one line: broken there it doubles
          the height of the bar, which is part of what pushed the foot of the
          hero past the bottom of the viewport. `hidden` stops a <br> breaking. */}
      <br className="hidden md:inline" />
      Han.
    </p>

    <div
      ref={setNavRef}
      className="mt-auto flex flex-row justify-end gap-[0.7rem] md:mt-0 md:flex-col md:items-end md:gap-0 md:pb-[0.3rem]"
    >
      {items.map(({ id, label, onSelect }, i) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onSelect}
          className="block font-urbanist font-semibold text-[0.7rem] leading-[0.9] whitespace-nowrap text-ink transition-colors hover:text-ash focus-visible:outline-ink md:grid md:grid-cols-[1.6rem_minmax(0,1fr)] md:items-baseline md:text-[clamp(1.15rem,1.6vw,1.5rem)] md:leading-[1.55]"
        >
          {/* The numbering matches the counter on the spread opposite, and is
              decorative in the same way — the label is what names the section.
              Dropped on a phone, where three links share one line and there is
              no room for a second column. */}
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
