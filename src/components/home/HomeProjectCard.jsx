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
//          cells are hand-placed and that layout lives with the grid. The grid gap
//          keeps the cells from touching, so each one carries a full border of its
//          own rather than sharing a single seam with its neighbour — and so does
//          the reveal animation and the hover zoom on the shot.
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
  const { name, category, description, image } = project;
  const isSlide = variant === "slide";
  const isLead = index === 0;

  // Base tone is the hero's paper rather than pure white, held back a step so the
  // title stays the brightest thing in the strip; the hover brings it to full. It
  // used to go to `moss` on hover, which is a mid-green sitting at 1.9:1 on the
  // card — the arrow all but vanished at the moment it was being pointed at.
  const arrowLinkClassName =
    "grid h-6 w-6 shrink-0 place-items-center text-cream/70 transition-[transform,color] duration-200 hover:translate-x-[2px] hover:-translate-y-[2px] hover:text-cream focus-visible:outline-ink motion-reduce:transition-none md:h-7 md:w-7";

  return (
    <article
      className={cn(
        "group flex min-h-0 flex-col",
        !isSlide && `border ${GRID_BORDER_COLOR}`,
        isSlide
          ? "h-full min-w-0 flex-[0_0_100%]"
          : cn("animate-project-reveal motion-reduce:animate-none", position),
      )}
      style={
        isSlide ? undefined : { animationDelay: `${index * REVEAL_STAGGER_MS}ms` }
      }
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-well">
        <img
          src={`/images/projects/${image.src}`}
          alt={`${name} — ${category}`}
          width={image.width}
          height={image.height}
          loading={eager || isSlide ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className={cn(
            "block h-full w-full object-cover object-top",
            !isSlide &&
              cn(
                "transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transition-none",
                // The two stacked cells are wide and shallow, and both their
                // shots are landscape, so a fill crops them from the top down to
                // a band — a laptop with its screen cut in half, three phones
                // with their feet gone. Containing them mats the shot instead,
                // which is the whole point of a well that is darker than the
                // card. This used to wait until `wide`, and everything between
                // md and 1440px got the beheaded crop.
                //
                // Centred, not top-aligned: a contained image pinned to the top
                // pools all its matting at the foot of the card, which reads as
                // a cropping mistake rather than as a frame.
                !isLead && "md:object-contain md:object-center",
              ),
          )}
        />
      </div>

      {/* Sized in viewport units from md up so the strip gives back height on a
          short screen rather than eating into the shot above it. */}
      <div
        className={cn(
          "w-full shrink-0 bg-surface",
          `border-t ${GRID_BORDER_COLOR}`,
          "px-[0.6rem] pt-[0.4rem] pb-[0.5rem]",
          "md:px-[clamp(0.7rem,0.95vw,1.15rem)] md:pt-[clamp(0.5rem,0.8vh,0.85rem)] md:pb-[clamp(0.55rem,0.9vh,0.95rem)]",
        )}
      >
        {/* The kicker speaks in the same tracked small-caps as the panel's own
            header — see EYEBROW_CLASS in HomeWork. */}
        <p className="flex items-center justify-between gap-3 font-outfit text-[0.55rem] leading-none font-medium tracking-[0.14em] text-cream/45 uppercase md:text-[clamp(0.58rem,0.68vw,0.7rem)]">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="truncate text-right">{category}</span>
        </p>

        <div className="mt-[0.3rem] flex items-center justify-between gap-2 md:mt-[clamp(0.3rem,0.6vh,0.55rem)]">
          <h3 className="font-heading truncate text-[0.95rem] leading-[1.05] text-cream md:text-[clamp(1.05rem,1.35vw,1.5rem)]">
            {name}
          </h3>

          <a
            href="#projects"
            onClick={onSelect}
            aria-label={`View the ${name} project`}
            className={arrowLinkClassName}
          >
            <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem] md:h-[1.05rem] md:w-[1.05rem]" />
          </a>
        </div>

        {/* The lead card alone carries copy, and only from 1440px.
        
            The two stacked cards used to carry it too, and it was what threw the
            spread off: their strips are half the depth, so the same two-line clamp
            landed one card on a single line and cut the next mid-word. Holding the
            description to the card that has the room for it gives the stacked pair
            an identical, shallower strip — they now read as a matched pair against
            the lead, and hand the height they save back to their shots.
        
            The full write-up for every project is a scroll away in Projects, which
            is where this card links. */}
        {isLead && (
          <div className="hidden wide:mt-[clamp(0.35rem,0.7vh,0.6rem)] wide:block">
            {/* No block utility alongside the clamp: line-clamp sets its own
                display, and a second display utility in the same breakpoint would
                win by source order and drop the clamp. */}
            <p className="line-clamp-2 max-w-[46ch] font-outfit text-[clamp(0.72rem,0.8vw,0.82rem)] leading-[1.5] text-cream/55">
              {description}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default HomeProjectCard;
