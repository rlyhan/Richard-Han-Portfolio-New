import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import { GRID_BORDER_COLOR } from "./HomeWork";

// One card of the hero's spread: the image fills whatever height it is left, and the
// meta strip below it is the fixed part.
//
// Two variants, because the spread is a hand-placed masonry grid from md up and a
// swipable carousel below it — see HomeWork and HomeProjectCarousel:
//
//   grid   `position` is the cell, passed in rather than derived, since the three
//          cells are hand-placed and that layout lives with the grid. The seam
//          borders belong to this variant too: they draw the grid's own lines, and
//          so does the reveal animation and the hover zoom on the shot.
//   slide  a full-width track item, sized to the view and neither shrinking nor
//          growing to its neighbours. No seams — there is no neighbouring cell for a
//          line to sit against — and no crop of its own: every slide fills, whatever
//          the shot's ratio, because the cards pass under the thumb one at a time and
//          a letterboxed one reads as a gap rather than as a different shape.
//
// Nothing animates a slide, and that isn't a preference: the carousel loops by
// writing an inline transform to the slide element, and an animation's transform
// outranks an inline style, so a filled-forwards reveal pins the slide and the wrap
// opens a gap where the card should be. The deck carries the reveal instead. The
// hover zoom goes with it — a touch that starts a drag counts as a hover, so on a
// phone the shot would swell mid-swipe and stay swollen after it.
//
// A slide's shot also loads eagerly whatever its place in the deck: a lazy image
// parked outside a horizontal track has nothing to bring it in until the swipe that
// reveals it, so the first swipe would land on a blank card. The priority hint stays
// with the lead card either way.
//
// The card is a link to the Projects section rather than to the project itself —
// the page is one document, and the full write-up with its gallery is down there.

const HomeProjectCard = ({
  project,
  index,
  position,
  variant = "grid",
  eager,
  onSelect,
}) => {
  const { name, category, description, image } = project;
  const isSlide = variant === "slide";

  const arrowLinkClassName =
    "grid h-6 w-6 shrink-0 place-items-center text-ink transition-[transform,color] duration-200 hover:translate-x-[2px] hover:-translate-y-[2px] hover:text-moss focus-visible:outline-ink motion-reduce:transition-none md:h-8 md:w-8";

  return (
    <article
      className={cn(
        "group flex min-h-0 flex-col items-center bg-[#1E271E]",
        isSlide
          ? "h-full min-w-0 flex-[0_0_100%]"
          : cn("animate-project-reveal motion-reduce:animate-none", position),
      )}
    >
      <div
        className={cn(
          "min-h-0 flex w-full flex-1 items-center justify-center overflow-hidden",
          !isSlide && index === 0 ? `border-r ${GRID_BORDER_COLOR}` : "",
          !isSlide && index === 1 ? `border-b ${GRID_BORDER_COLOR}` : "",
        )}
      >
        <img
          src={`/images/projects/${image.src}`}
          alt={`${name} — ${category}`}
          width={image.width}
          height={image.height}
          loading={eager || isSlide ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className={cn(
            "block",
            isSlide
              ? "h-full w-full object-cover object-top"
              : cn(
                  "transition-transform duration-500 group-hover:scale-[1.1] motion-reduce:transition-none",
                  index === 0
                    ? "h-full w-auto max-w-full"
                    : "h-full w-full object-cover object-top wide:object-contain",
                ),
          )}
        />
      </div>

      <div
        className={cn(
          "bg-cream w-full pt-[0.4rem] pb-[0.5rem] px-[0.6rem]",
          "md:pt-[0.6rem] md:px-3 md:max-wide:pb-3 md:max-wide:min-h-[3.8rem]",
          "wide:pb-[1.1rem]",
          index === 0 ? `wide:min-h-[5.2rem]` : "wide:min-h-[4.7rem]",
        )}
      >
        <p className="flex justify-between gap-4 text-[0.55rem] leading-[1.4] font-medium text-moss uppercase md:text-[0.66rem]">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{category}</span>
        </p>

        <div className="mt-[0.15rem] flex items-center justify-between gap-2 md:mt-[0.35rem]">
          <h3 className="font-heading text-[0.95rem] leading-none md:text-[clamp(1.15rem,1.5vw,1.6rem)]">
            {name}
          </h3>

          {/* Stands in for the description's own arrow until 1440px, where the
                      description appears and takes over pairing with it below. */}
          <a
            href="#projects"
            onClick={onSelect}
            aria-label={`View the ${name} project`}
            className={cn(arrowLinkClassName, "wide:hidden")}
          >
            <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem] md:h-[1.05rem] md:w-[1.05rem]" />
          </a>
        </div>

        {/* Held back until 1440px: under that the strip is only deep enough for
                    the kicker and the title, and the description would crowd them. */}
        <div className="hidden wide:mt-[0.35rem] wide:flex wide:items-center wide:justify-between wide:gap-2">
          {/* No block utility alongside the clamp: line-clamp sets its own display,
                      and a second display utility in the same breakpoint would win by
                      source order and drop the clamp. */}
          <p className="wide:line-clamp-2 wide:max-w-96 wide:text-[0.72rem] wide:leading-[1.35] wide:text-moss">
            {description}
          </p>

          <a
            href="#projects"
            onClick={onSelect}
            aria-label={`View the ${name} project`}
            className={cn(arrowLinkClassName, "hidden wide:grid")}
          >
            <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem] md:h-[1.05rem] md:w-[1.05rem]" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default HomeProjectCard;
