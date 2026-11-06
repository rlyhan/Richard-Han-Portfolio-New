import cn from "classnames";
import { INTRO_LINES, INTRO_NOTE } from "../../data/home.data";
import { MD_UP, useMediaQuery } from "../../hooks/useMediaQuery";
import Byline from "../layout/Byline";
import SplitLine from "../common/SplitLine";
import ProjectTicker from "../common/ProjectTicker";

export const INTRO_GUTTER_CLASS =
  "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

// The left half of the hero: the byline at the top, and the name with its note.
// Below md the ticker follows them, full-bleed down to the blocks. From md this
// spans the hero's full height in two equal rows: the note closes the top one and
// the name opens the bottom, its cap line level with the split between About and
// Contact. The foot it overlaps is HomeFooter's.
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
        "flex min-h-min min-w-0 flex-1 flex-col overflow-hidden pt-[1.35rem] md:col-start-1 md:row-span-2 md:row-start-1 md:grid md:min-h-0 md:grid-rows-2 md:items-start md:pt-6 md:pb-6",
        INTRO_GUTTER_CLASS,
      )}
    >
      <div className="md:col-start-1 md:row-start-1">
        <Byline topLineRef={setToplineRef} />
      </div>

      <div className="mt-[clamp(1.5rem,5svh,3rem)] flex flex-1 flex-col md:contents">
        <h1
          ref={headingRef}
          id="home-heading"
          className="font-heading text-[clamp(2.6rem,min(12.8vw,7.2svh),4.25rem)] leading-[0.88] tracking-[-0.015em] text-ink uppercase md:row-start-2 md:leading-[0.86] md:text-[clamp(3.5rem,min(5.9vw,11svh),5.875rem)] md:[text-box:trim-start_cap_alphabetic]"
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
          className="mt-[clamp(0.95rem,3svh,1.6rem)] max-w-[25.5rem] pr-8 font-arial text-[0.8125rem] leading-[1.45] tracking-[-0.01em] text-pretty text-hush md:col-start-1 md:row-start-1 md:mt-0 md:mb-8 md:max-w-[34ch] md:self-end md:pr-0 md:text-[clamp(1.25rem,1.75vw,1.625rem)] md:leading-[1.3]"
        >
          {INTRO_NOTE}
        </p>

        {!isMdUp && (
          <div
            aria-hidden="true"
            className="-mx-[1.4rem] mt-[clamp(1.5rem,5svh,3rem)] min-h-0 flex-1"
          >
            <ProjectTicker sizes="35vh" />
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeIntro;
