import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import { EYEBROW_CLASS, GRID_BORDER_COLOR } from "./HomeWork";

// One card of the hero's spread: a dark well with the shot matted whole inside it
// and a caption plate framed over the foot of it.
//
// Matted rather than cropped, at every size. The three shots are device mockups of
// three different shapes — a tablet, a laptop, three phones — and a fill would cut
// each one down to whatever band its cell happens to be: a laptop with its screen
// halved, phones with their feet gone. Containing them on a ground darker than the
// page is what makes the cell read as a frame the object hangs in, so the matting
// is the point rather than a shortfall. The slight scale-up is there to keep the
// object filling its frame; the hover takes it a step further.
//
// The caption sits ON the well instead of in a strip under it. A plate in the
// hero's paper tone, over a dark ground, reads as a label pinned to the frame —
// and it costs the shot nothing, because what it covers is matting.
//
// Two variants, because the spread is a hand-placed masonry grid from md up and a
// swipable carousel below it — see HomeWork and HomeProjectCarousel:
//
//   grid   `position` is the cell, passed in rather than derived, since the three
//          cells are hand-placed and that layout lives with the grid. The cells
//          share seams, so each one draws only its right and bottom edge — the
//          grid supplies the two no cell owns. The reveal and the hover zoom
//          belong to this variant.
//   slide  a full-width track item, sized to the view and neither shrinking nor
//          growing to its neighbours. No seams — there is no neighbouring cell for
//          a line to sit against — and a shallower caption, since the plate has a
//          phone's column to fit in rather than half a screen.
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

// The grid's cards arrive one after the other rather than together: the spread is
// read left to right, and a stagger walks the eye that way instead of flashing the
// whole panel on at once. Small enough to finish well inside the reveal itself.
const REVEAL_STAGGER_MS = 120;

const HomeProjectCard = ({
  project,
  index,
  position,
  variant = "grid",
  eager,
  onSelect,
}) => {
  const { name, category, image } = project;
  const isSlide = variant === "slide";
  const isLead = index === 0;

  return (
    <article
      className={cn(
        "group relative overflow-hidden bg-well",
        isSlide
          ? "h-full min-w-0 flex-[0_0_100%]"
          : cn(
              `border-r border-b ${GRID_BORDER_COLOR}`,
              "animate-project-reveal motion-reduce:animate-none",
              position,
            ),
      )}
      style={
        isSlide ? undefined : { animationDelay: `${index * REVEAL_STAGGER_MS}ms` }
      }
    >
      {/* The frame the shot hangs in. Its foot stops above the caption plate
          rather than running under it: the object stays whole, and the plate has
          nothing behind it to show through. */}
      <div
        className={cn(
          "absolute overflow-hidden",
          isSlide
            ? "inset-x-2 top-2 bottom-[3.35rem]"
            : "inset-x-[clamp(0.9rem,1.6vw,1.9rem)] top-4 bottom-[clamp(4.25rem,6.5vh,5.25rem)]",
        )}
      >
        <img
          src={`/images/projects/${image.src}`}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager || isSlide ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className={cn(
            "block h-full w-full object-contain object-center",
            isSlide
              ? "scale-[1.03]"
              : cn(
                  "transition-transform duration-500 motion-reduce:transition-none",
                  // The lead cell is the tall one and its shot is the tall one,
                  // so it has the least matting to give back and can afford the
                  // wider gesture.
                  isLead
                    ? "scale-[1.12] group-hover:scale-[1.18]"
                    : "scale-[1.06] group-hover:scale-[1.11]",
                ),
          )}
        />
      </div>

      {/* The plate: number and title on one line, category under the title, and
          the link out held to the right of both.

          A minimum depth rather than a set one, so a title that has to wrap grows
          the plate instead of spilling out of it. */}
      <div
        className={cn(
          `absolute grid items-baseline border ${GRID_BORDER_COLOR} bg-cream`,
          "grid-cols-[auto_minmax(0,1fr)_auto]",
          isSlide
            ? "inset-x-1.5 bottom-1.5 min-h-11 gap-x-1.5 gap-y-1 px-2 py-1.5"
            : "inset-x-3.5 bottom-3.5 min-h-[3.625rem] gap-x-2 gap-y-1.5 px-4 pt-[0.8rem] pb-3",
        )}
      >
        <span
          className={cn(
            EYEBROW_CLASS,
            "text-ash",
            isSlide ? "text-[0.5rem]" : "text-[0.5625rem]",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className={cn(
            "font-urbanist truncate leading-[1.15] font-bold text-ink",
            isSlide ? "text-[0.85rem]" : "text-[clamp(1rem,1.35vw,1.2rem)]",
          )}
        >
          {name}
        </h3>

        {/* Spans both rows and centres on them, so the arrow sits with the plate
            rather than on the baseline of either line of type. */}
        <a
          href="#projects"
          onClick={onSelect}
          aria-label={`View the ${name} project`}
          className={cn(
            "col-start-3 row-span-2 row-start-1 grid shrink-0 place-items-center self-center",
            "text-ash transition-[transform,color] duration-200 hover:-translate-y-px hover:translate-x-px hover:text-ink focus-visible:outline-ink motion-reduce:transition-none",
            isSlide ? "h-4 w-4" : "h-6 w-6",
          )}
        >
          <ArrowUpRightIcon
            className={isSlide ? "h-3 w-3" : "h-[0.95rem] w-[0.95rem]"}
          />
        </a>

        <p
          className={cn(
            EYEBROW_CLASS,
            "col-start-2 row-start-2 self-end truncate text-ash",
            isSlide ? "text-[0.5rem]" : "text-[0.5625rem]",
          )}
        >
          {category}
        </p>
      </div>
    </article>
  );
};

export default HomeProjectCard;
