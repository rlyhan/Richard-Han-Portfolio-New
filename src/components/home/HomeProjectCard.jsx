import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import { GRID_BORDER_COLOR } from "./HomeWork";

// One cell of the hero's masonry grid: the image fills whatever height the grid
// leaves it, and the meta strip below it is the fixed part.
//
// `position` is the grid placement, passed in rather than derived: the three cells
// are hand-placed, so the layout lives with the grid in HomeWork.
//
// The card is a link to the Projects section rather than to the project itself —
// the page is one document, and the full write-up with its gallery is down there.

const HomeProjectCard = ({ project, index, position, eager, onSelect }) => {
  const { name, category, description, image } = project;

  return (
    <article
      className={cn(
        "group animate-project-reveal motion-reduce:animate-none flex min-h-0 flex-col items-center bg-[#1E271E]",
        position,
      )}
    >
      <div
        className={cn(
          "min-h-0 flex w-full flex-1 items-center justify-center",
          index === 0 ? `border-r ${GRID_BORDER_COLOR}` : "",
          index === 1 ? `border-b ${GRID_BORDER_COLOR}` : "",
        )}
      >
        <img
          src={`/images/projects/${image.src}`}
          alt={`${name} — ${category}`}
          width={image.width}
          height={image.height}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className={cn(
            "block",
            index === 0
              ? "h-full w-auto max-w-full"
              : "h-full w-full object-cover object-top wide:object-contain transition-transform duration-700 group-hover:scale-[1.012] motion-reduce:transition-none",
          )}
        />
      </div>

      <div
        className={cn(
          "bg-cream w-full relative pt-[0.4rem] pb-[0.5rem] pl-[0.6rem] pr-[1.2rem]",

          "md:pt-[0.6rem] md:pl-3 md:max-wide:pb-3 md:max-wide:min-h-[3.8rem]",
          "wide:pb-[1.1rem]",
          index === 0 ? `wide:min-h-[5.2rem]` : "wide:min-h-[4.7rem]",
        )}
      >
        <p className="flex justify-between gap-4 text-[0.55rem] leading-[1.4] font-medium text-moss uppercase md:text-[0.66rem]">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{category}</span>
        </p>

        <h3 className="mt-[0.15rem] font-heading text-[0.95rem] leading-none md:mt-[0.35rem] md:text-[clamp(1.15rem,1.5vw,1.6rem)]">
          {name}
        </h3>

        {/* Held back until 1440px: under that the strip is only deep enough for
                    the kicker and the title, and the description would crowd them. */}
        {/* No block utility alongside the clamp: line-clamp sets its own display,
                    and a second display utility in the same breakpoint would win by
                    source order and drop the clamp. */}
        <p className="hidden wide:mt-[0.35rem] wide:line-clamp-2 wide:max-w-96 wide:text-[0.72rem] wide:leading-[1.35] wide:text-moss">
          {description}
        </p>

        <a
          href="#projects"
          onClick={onSelect}
          aria-label={`View the ${name} project`}
          className="absolute right-[0.35rem] bottom-[0.3rem] grid h-6 w-6 place-items-center text-ink transition-[transform,color] duration-200 hover:translate-x-[2px] hover:-translate-y-[2px] hover:text-moss focus-visible:outline-ink motion-reduce:transition-none md:right-[0.7rem] wide:bottom-[0.8rem] md:h-8 md:w-8"
        >
          <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem] md:h-[1.05rem] md:w-[1.05rem]" />
        </a>
      </div>
    </article>
  );
};

export default HomeProjectCard;
