import cn from "classnames";
import { INTRO_LINES, INTRO_NOTE } from "../../data/home.data";
import Byline from "../layout/Byline";
import SplitLine from "../common/SplitLine";
import { NOTE_TEXT_CLASS } from "../layout/sharedClasses";

// The left half of the hero: the display lines, the byline above them and the note
// under them, all on the hero's paper ground.
//
// Three planes the hero's exit moves, and they don't all leave together — see
// useHeroHandoff. The h1's lines and the note rise (`setLineRef`, `setNoteRef`);
// the byline sinks with the furniture at the hero's foot (`setToplineRef`),
// since it reads as a masthead line, not part of the h1. The indices belong to
// Home, so this stays unaware of where in either stagger it lands.
const HomeIntro = ({ headingRef, setLineRef, setNoteRef, setToplineRef }) => (
  <section
    aria-labelledby="home-heading"
    className="flex min-h-min min-w-0 flex-1 flex-col overflow-hidden px-[1.4rem] pt-[1.35rem] pb-[clamp(1.25rem,4svh,2.1rem)] md:min-h-0 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-10"
  >
    <Byline topLineRef={setToplineRef} hideNameBelowMd />

    <h1
      ref={headingRef}
      id="home-heading"
      className="mt-[clamp(1.15rem,4.2svh,2.2rem)] font-urbanist text-[clamp(2.6rem,min(12.8vw,7.2svh),4.25rem)] leading-[1.02] font-medium text-ink md:mt-[clamp(2.4rem,7vh,5.6rem)] md:leading-[0.99] md:max-wide:text-[clamp(2.6rem,4.4vw,4.25rem)] wide:text-[clamp(4.25rem,5.9vw,5.875rem)]"
    >
      {INTRO_LINES.map((line, i) => (
        <span
          key={line}
          ref={(el) => {
            setLineRef(i, el);
          }}
          className="block"
        >
          <SplitLine text={line} />
        </span>
      ))}
    </h1>
    <p
      ref={setNoteRef}
      className={cn(
        "mt-auto max-w-[25.5rem] pt-[clamp(0.95rem,3svh,1.6rem)] font-epilogue md:pt-10",
        NOTE_TEXT_CLASS,
      )}
    >
      {INTRO_NOTE}
    </p>
  </section>
);

export default HomeIntro;
