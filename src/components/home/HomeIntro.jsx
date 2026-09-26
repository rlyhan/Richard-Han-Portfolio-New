import { INTRO_LINES, INTRO_NOTE, INTRO_TOPLINE } from "../../data/home.data";

// The left half of the hero: the display lines, the byline above them and the note
// under them, all on the hero's paper ground.
//
// Three planes the hero's exit moves, and they don't all leave together — see
// useHeroToAboutHandoff. The h1's lines and the note rise (`setLineRef`,
// `setNoteRef`); the byline sinks with the furniture at the foot of the hero
// (`setToplineRef`), because it reads as a masthead line rather than as part of
// the h1. The indices belong to Home, so this stays unaware of where in either
// stagger it lands.
//
// overflow-hidden is the backstop for that exit: the lines drift sideways as they
// leave, and the panel clips the drift rather than letting it reach the page and
// open a horizontal scrollbar.
//
// The top padding on a phone is what it is to clear the scroll cue, which sits in
// the top-right corner at that size — see Home. From md up the cue moves to the
// foot of the viewport and the panel goes back to an even inset.
const HomeIntro = ({ setLineRef, setNoteRef, setToplineRef }) => (
  <section
    aria-labelledby="home-heading"
    className="flex min-w-0 flex-1 flex-col overflow-hidden px-[1.4rem] pt-[4.6rem] pb-[2.1rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-10"
  >
    {/* The location wraps rather than shrinking the type on a phone: two words
        over two lines in the corner still read as a dateline, where 9px type
        doesn't read at all. */}
    <p
      ref={setToplineRef}
      className="flex items-start justify-between gap-4 font-outfit text-[0.6875rem] leading-[1.25] font-medium tracking-[0.06em] text-ash uppercase"
    >
      <span>{INTRO_TOPLINE.name}</span>
      <span className="max-w-24 text-right md:max-w-none">
        {INTRO_TOPLINE.location}
      </span>
    </p>

    <h1
      id="home-heading"
      // Two sizes above md, because the copy's half of the hero is the one
      // that narrows: below `wide` it holds 44% of the screen, and at the
      // rate the display type grows there, "Auckland, NZ" wraps onto a
      // second line — four lines become five and the stack loses its shape.
      // From `wide` the halves even out and the type takes the room back.
      className="mt-[2.2rem] font-outfit text-[clamp(3.125rem,12vw,4.25rem)] leading-[1.02] font-medium text-ink md:mt-[clamp(2.4rem,7vh,5.6rem)] md:leading-[0.99] md:max-wide:text-[clamp(2.6rem,4.4vw,4.25rem)] wide:text-[clamp(4.25rem,5.9vw,5.875rem)]"
    >
      {INTRO_LINES.map((line, i) => (
        <span
          key={line}
          ref={(el) => {
            setLineRef(i, el);
          }}
          className="block"
        >
          {line}
        </span>
      ))}
    </h1>

    {/* mt-auto, so the note sits on the foot of the panel however tall the
        display lines end up: it's the closing line of the column, not a caption
        hanging off the h1. */}
    <p
      ref={setNoteRef}
      className="mt-auto max-w-[20.5rem] pt-[1.6rem] font-outfit text-[0.8125rem] leading-[1.65] text-ash md:pt-10"
    >
      {INTRO_NOTE}
    </p>
  </section>
);

export default HomeIntro;
