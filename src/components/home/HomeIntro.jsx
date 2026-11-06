import cn from "classnames";
import { INTRO_LINES, INTRO_NOTE } from "../../data/home.data";
import { MD_UP, useMediaQuery } from "../../hooks/useMediaQuery";
import Byline from "../layout/Byline";
import SplitLine from "../common/SplitLine";
import TickerGround from "../common/TickerGround";

export const INTRO_GUTTER_CLASS =
  "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

// The left half of the hero: the byline at the top, and the name with the note
// under it centred in what's left. What sits under it is HomeFooter's.
//
// Three planes the hero's exit moves, and they don't all leave together — see
// useHeroHandoff. The h1's lines and the note rise (`setLineRef`, `setNoteRef`);
// the byline sinks with the foot (`setToplineRef`), since it reads as the
// page's furniture, not part of the h1. The indices belong to Home, so this
// stays unaware of where in either stagger it lands.
const HomeIntro = ({ headingRef, setLineRef, setNoteRef, setToplineRef }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section
      aria-labelledby="home-heading"
      className={cn(
        "flex min-h-min min-w-0 flex-1 flex-col overflow-hidden pt-[1.35rem] md:min-h-0 md:pt-6 md:pb-6",
        INTRO_GUTTER_CLASS,
      )}
    >
      <Byline topLineRef={setToplineRef} />

      <div className="relative isolate -mx-[1.4rem] mt-[1.35rem] flex flex-1 flex-col justify-center px-[1.4rem] py-[clamp(1rem,3svh,2.2rem)] md:mx-0 md:my-auto md:block md:flex-none md:px-0 md:pt-[clamp(2.4rem,7vh,5.6rem)] md:pb-0">
        {!isMdUp && <TickerGround />}

        <h1
          ref={headingRef}
          id="home-heading"
          className="font-heading text-[clamp(2.6rem,min(12.8vw,7.2svh),4.25rem)] leading-[0.88] tracking-[-0.015em] text-chalk uppercase md:leading-[0.86] md:text-ink md:max-wide:text-[clamp(2.6rem,4.4vw,4.25rem)] wide:text-[clamp(4.25rem,5.9vw,5.875rem)]"
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
          className="mt-[clamp(0.95rem,3svh,1.6rem)] max-w-[25.5rem] pr-8 font-urbanist text-[0.75rem] leading-[1.5] font-medium text-chalk md:mt-6 md:pr-0 md:text-[0.9375rem] md:leading-[1.6] md:text-hush"
        >
          {INTRO_NOTE}
        </p>
      </div>
    </section>
  );
};

export default HomeIntro;
