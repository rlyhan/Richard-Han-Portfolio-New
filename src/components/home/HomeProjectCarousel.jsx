import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import HomeProjectCard from "./HomeProjectCard";

// The mobile half of the hero's spread: the three featured projects as one swipable
// card rather than the desktop masonry, which has no room to spread at phone widths.
//
// loop, because the deck is three cards deep — a swipe past the last one wrapping
// round reads better than a dead end at either edge. It is also the one option here
// that carries a standing condition: looping moves a slide to the far end of the
// track by writing an inline transform to that slide element, so nothing may animate
// or transform a slide itself. The reveal below is on the deck rather than on the
// cards for that reason, and the cards' hover zoom is scoped to the desktop grid —
// see HomeProjectCard.
//
// Nothing else is set. With one slide per view the alignment and containment options
// have nothing left to choose between, and carrying them anyway only leaves the snap
// maths looking like a decision that could be revisited.
const OPTIONS = { loop: true };

// The track is the only thing here that claims the horizontal axis, so a vertical
// swipe over a card still scrolls the page.
//
// The dots are the only sign that the deck is deeper than one card, so they sit in
// the corner of the well, over the matting rather than over the shot. A flat
// translucent fill lifts them off it — no backdrop blur, since inside the carousel's
// clipping, transformed box that is both the most expensive thing on the page to
// repaint while a finger is dragging and the least reliable: WebKit samples the
// wrong backdrop under a transformed ancestor.
const HomeProjectCarousel = ({ projects }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selected, setSelected] = useState(0);

  // reInit as well as select: the carousel is remounted across the breakpoint, and a
  // slide can settle before this effect has subscribed.
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => { setSelected(emblaApi.selectedScrollSnap()); };

    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => { emblaApi.off("select", onSelect).off("reInit", onSelect); };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => () => { emblaApi?.scrollTo(index); },
    [emblaApi],
  );

  return (
    <div
      className="relative min-h-0 min-w-0 animate-project-reveal motion-reduce:animate-none"
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {projects.map((project, i) => (
            <HomeProjectCard
              key={project.id}
              project={project}
              index={i}
              variant="slide"
              eager={i === 0}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-cream/15 px-1.5 py-1">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={scrollTo(i)}
            aria-label={`Show ${project.name}`}
            aria-current={i === selected}
            className="grid h-4 w-4 place-items-center rounded-full p-0"
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-[0.3rem] w-[0.3rem] rounded-full transition-colors duration-200 motion-reduce:transition-none",
                i === selected ? "bg-cream" : "bg-cream/45",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeProjectCarousel;
