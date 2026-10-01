import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import MattedShot from "../common/MattedShot";
import { projectPathOf } from "../../routes/routes";
import { useNavLink } from "../../hooks/useNavLinks";
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
// A shot photographed in a room is the exception and runs to the edges of the cell
// instead — see MattedShot and shots.data. It brings a ground with it, so the well
// has nothing to show and the inset frame would read as a picture inside a picture.
// It keeps no base scale for the same reason it needs none: it already fills.
//
// A matted shot's frame stops above the caption plate rather than running under it:
// the object stays whole, and the plate has nothing behind it to show through. A
// bleed shot has to run under it — the ground is the picture — so what keeps the
// device whole there is the shot's own floor, and the crop that never touches it.
// The slide drops the top inset either way: a phone gives the deck a third of the
// screen at most, and matting the scarce axis spends it on ground, where the well's
// own top edge already reads as the frame.
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
// The card links straight to the project's write-up, the same page ProjectTile
// points at from the Projects listing.

// The grid's cards arrive one after the other rather than together: the spread is
// read left to right, and a stagger walks the eye that way instead of flashing the
// whole panel on at once. Small enough to finish well inside the reveal itself.
const REVEAL_STAGGER_MS = 120;

// What the browser picks a width for, and in vh because these cells are sized off
// the viewport's height rather than its width — see MattedShot on why a bleed shot
// is cropped to its frame's height times the shots' 16:9. The lead cell is the
// panel's full height, the other two are half of it, and the phone carousel's slide
// stands in a 35svh panel.
const SHOT_SIZES = { lead: "150vh", cell: "75vh", slide: "55vh" };

const HomeProjectCard = ({
  project,
  index,
  position,
  variant = "grid",
  eager,
}) => {
  const { id, name, category, image } = project;
  const projectLink = useNavLink(projectPathOf(id));
  const isSlide = variant === "slide";
  const isLead = index === 0;
  const isBleed = image.fit === "bleed";

  // A bleed shot takes no base scale, since it already fills the cell — only the
  // hover step. A matted lead cell takes the widest gesture of the three: it is the
  // tall cell and takes the tall shot, so it has the least matting to give back.
  const zoom = isSlide
    ? undefined
    : isBleed
      ? "group-hover:scale-[1.04]"
      : isLead
        ? "scale-[1.12] group-hover:scale-[1.18]"
        : "scale-[1.06] group-hover:scale-[1.11]";

  return (
    <article
      className={cn(
        "relative overflow-hidden bg-well",
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
      <a
        {...projectLink}
        aria-label={`View the ${name} project`}
        className="group block h-full focus-visible:outline-cream focus-visible:-outline-offset-4"
      >
        <div
          className={cn(
            "absolute overflow-hidden",
            isBleed
              ? "inset-0"
              : isSlide
                ? "inset-x-2 top-0 bottom-[3.35rem]"
                : "inset-x-[clamp(0.9rem,1.6vw,1.9rem)] top-4 bottom-[clamp(4.25rem,6.5vh,5.25rem)]",
          )}
        >
          <MattedShot
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            eager={eager || isSlide}
            sizes={
              isSlide
                ? SHOT_SIZES.slide
                : isLead
                  ? SHOT_SIZES.lead
                  : SHOT_SIZES.cell
            }
            fit={image.fit}
            className={isSlide && !isBleed ? "scale-[1.03]" : undefined}
            zoom={zoom}
          />
        </div>

        {/* The plate: number and title on one line, category under the title,
            and the arrow held to the right of both — decorative, since the
            link is the whole card now.

            A minimum depth rather than a set one, so a title that has to wrap
            grows the plate instead of spilling out of it. */}
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

          {/* Spans both rows and centres on them, so the arrow sits with the
              plate rather than on the baseline of either line of type. */}
          <span
            aria-hidden="true"
            className={cn(
              "col-start-3 row-span-2 row-start-1 grid shrink-0 place-items-center self-center text-ash",
              "transition-[transform,color] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink motion-reduce:transition-none",
              isSlide ? "h-4 w-4" : "h-6 w-6",
            )}
          >
            <ArrowUpRightIcon
              className={isSlide ? "h-3 w-3" : "h-[0.95rem] w-[0.95rem]"}
            />
          </span>

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
      </a>
    </article>
  );
};

export default HomeProjectCard;
