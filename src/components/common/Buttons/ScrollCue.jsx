import { useEffect, useRef } from "react";
import cn from "classnames";
import gsap from "gsap";
import ArrowDownIcon from "../../icons/ArrowDownIcon";

const BOUNCE_DISTANCE = 10;
const BOUNCE_DURATION = 0.9;
const FADE_DURATION = 0.35;

// The hint at the foot of the hero, handing the viewer into the page below.
//
// The homepage is the one page that hands over on the scroll, so this is the one
// place a cue belongs: everywhere else the foot of the page is the foot of the
// document and the nav bar is the way on. It carries no fill — the hero is paper end
// to end, and a filled disc there reads as a button dropped on a print layout, so a
// hairline ring is enough and the hover is a wash rather than a flip to solid. The
// focus ring comes with it, the page's default being all but invisible on that
// ground.
//
// The bounce lives on an inner element so the infinite y tween and the visibility
// fade never write to the same target.
//
// `positionClassName` is where in its parent it sits — the offset and the alignment
// both, since a cue that isn't at the foot usually isn't centred either.
const ScrollCue = ({ onClick, visible, label, positionClassName }) => {
  const containerRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(arrowRef.current, {
        y: BOUNCE_DISTANCE,
        duration: BOUNCE_DURATION,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    gsap.to(containerRef.current, {
      opacity: visible ? 1 : 0,
      duration: FADE_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [visible]);

  return (
    <div
      ref={containerRef}
      // Absolute, so the caller has to give it a positioned parent: the cue
      // belongs to the foot of the page it leads off, not to the foot of the
      // viewport, and the two part company over the last stretch of scroll —
      // where a cue held to the viewport sits on whatever is below the page.
      className={cn(
        "absolute inset-x-0 z-40 flex pointer-events-none",
        positionClassName,
      )}
      // As in the header: a real button, so hiding it visually has to take it
      // out of the tab order too.
      inert={!visible}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="pointer-events-auto rounded-full border border-ink/30 p-3 text-ink backdrop-blur-sm transition-colors hover:border-ink/60 hover:bg-ink/[0.07] focus-visible:outline-ink"
      >
        <span ref={arrowRef} className="block">
          <ArrowDownIcon className="h-6 w-6" />
        </span>
      </button>
    </div>
  );
};

export default ScrollCue;
