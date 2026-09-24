import { INTRO_LINES, INTRO_NOTE } from "../../data/home.data";

// The left half of the hero: the dark panel the display lines sit on.
//
// Each line is its own element rather than one heading broken by <br>, because the
// hero's exit staggers them apart — see useHeroToAboutHandoff. `setLineRef` and
// `setNoteRef` are how Home collects them; the indices belong to Home, so this stays
// unaware of where in the stagger it lands.
//
// overflow-hidden is the backstop for that exit: the lines drift sideways as they
// leave, and the panel clips the drift rather than letting it reach the page and
// open a horizontal scrollbar.
const HomeIntro = ({ setLineRef, setNoteRef }) => (
  <section
    aria-labelledby="home-heading"
    className="flex min-w-0 flex-1 flex-col justify-between overflow-hidden bg-ink px-[1.35rem] pt-[2.2rem] pb-[2.1rem] md:p-[clamp(2rem,4vw,4.5rem)]"
  >
    <h1
      id="home-heading"
      className="font-outfit text-mineral text-[2.15rem] leading-[1.08] md:text-[clamp(3.5rem,6.1vw,6.7rem)] md:leading-[0.98]"
    >
      {INTRO_LINES.map((line, i) => (
        <span
          key={line}
          ref={(el) => {
            setLineRef(i, el);
          }}
          // block, because the exit writes a transform to each line and an
          // inline box would ignore it.
          className="block"
        >
          {line}
        </span>
      ))}
    </h1>

    <p
      ref={setNoteRef}
      className="mt-[1.6rem] max-w-100 text-[0.8rem] leading-[1.55] text-cream/[0.68] md:mt-12 md:text-[0.95rem]"
    >
      {INTRO_NOTE}
    </p>
  </section>
);

export default HomeIntro;
