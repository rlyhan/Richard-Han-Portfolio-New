import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import HomeProjectCard from "./HomeProjectCard";

// The mobile half of the hero's spread: the three featured projects as one swipable
// card rather than the desktop masonry, which has no room to spread at phone widths.
//
// loop: the deck is three cards deep, and a swipe past the last one wrapping
// round reads better than a dead end at either edge. It's also the one option
// here with a standing condition — looping moves a slide to the far end of the
// track by writing an inline transform to it, so nothing may animate or
// transform a slide itself. That's why the reveal below is on the deck, not the
// cards, and why the cards' hover zoom is scoped to the desktop grid — see
// HomeProjectCard.
//
// Nothing else is set: with one slide per view, alignment and containment have
// nothing left to choose between, and carrying them anyway would only leave the
// snap maths looking like a decision that could be revisited.
const OPTIONS = { loop: true };

// The track is the only thing here that claims the horizontal axis, so a vertical
// swipe over a card still scrolls the page.
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
            />
          ))}
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-chalk/15 px-1.5 py-1">
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
                i === selected ? "bg-chalk" : "bg-chalk/45",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeProjectCarousel;
