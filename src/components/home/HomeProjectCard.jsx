import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import MattedShot from "../common/MattedShot";
import { projectPathOf } from "../../routes/routes";
import { useNavLink } from "../../hooks/useNavLinks";
import { EYEBROW_CLASS, GRID_BORDER_COLOR } from "./HomeWork";
import { PROJECT_LINK_CLASS } from "../layout/sharedClasses";

// One card of the hero's spread: a dark well with the shot matted whole inside it
// and a caption plate framed over the foot of it.
//
// Two variants — `grid`, a hand-placed masonry cell, and `slide`, a full-width
// carousel track item — see HomeWork and HomeProjectCarousel.
//
// Nothing animates a slide — not a preference: the carousel loops by writing an
// inline transform to the slide element, and an animation's transform outranks
// an inline style, so a filled-forwards reveal would pin the slide while the
// wrap opens a gap where the card should be. The deck carries the reveal
// instead, and the hover zoom goes with it — a touch that starts a drag counts
// as a hover, so a phone's shot would swell mid-swipe and stay swollen after.
//
// Every shot loads eagerly, in either layout: the spread shows all three cells
// at once, and a lazy image above the fold fetches after everything else the
// page needs; the deck's slides sit outside a horizontal track, so nothing
// brings a lazy image in before the swipe that reveals it, landing the first
// swipe on a blank card. All three are also preloaded from index.html — see
// there for why this document can't discover them on its own.

const REVEAL_STAGGER_MS = 120;

const HomeProjectCard = ({ project, index, position, variant = "grid" }) => {
  const { id, name, category, image } = project;
  const projectLink = useNavLink(projectPathOf(id));
  const isSlide = variant === "slide";
  const isLead = index === 0;
  const isBleed = image.fit === "bleed";

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
        className={PROJECT_LINK_CLASS}
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
            eager
            fit={image.fit}
            className={isSlide && !isBleed ? "scale-[1.03]" : undefined}
            zoom={zoom}
          />
        </div>

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
