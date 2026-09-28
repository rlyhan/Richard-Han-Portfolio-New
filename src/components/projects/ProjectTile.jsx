import cn from "classnames";
import AwardIcon from "../icons/AwardIcon";

// The Projects page's small-caps voice: each tile's number and category, and the
// award mark inside the category line. Tighter tracking than the hero's spread — at
// 9px in a plate this narrow, the hero's 0.18em pushes a two-word category into a
// wrap.
const EYEBROW_CLASS =
  "font-epilogue text-[0.5625rem] font-medium uppercase leading-none tracking-[0.06em]";

// The hero card's frame at three-column size — see HomeProjectCard for why the shots
// are matted rather than cropped. Two things differ at this size: the ground is
// `bg-frame`, a vignetted well rather than a flat one, since a flat fill reads as a
// slab this large (see tailwind.config); and there's no hover zoom, since the frame
// already fills and fourteen cells moving under the cursor would read as restless.
//
// Nothing here is interactive — the write-up each project leads to is a page of its
// own, not built yet — which is why the title is a real heading rather than a label
// on a button, whose children a screen reader treats as presentational.
const ProjectTile = ({ project, number }) => {
  const { name, category, award, images } = project;
  const image = images?.[0];

  return (
    <article
      data-reveal
      className="relative h-[clamp(21.25rem,60vw,27.5rem)] overflow-hidden border-r border-b border-grid bg-frame md:h-[clamp(17.5rem,44vw,25rem)] lg:h-[clamp(18.75rem,34vw,28.75rem)]"
    >
      <div className="absolute inset-x-5 top-3 bottom-24 flex items-center justify-center overflow-hidden md:inset-x-[1.625rem] md:top-4">
        {image ? (
          <img
            src={`/images/projects/${image}`}
            alt={`The ${name} site`}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-contain object-center"
          />
        ) : (
          <div aria-hidden="true" className="h-full w-full border border-grid bg-shell" />
        )}
      </div>

      <div className="absolute inset-x-3.5 bottom-3.5 grid min-h-[3.625rem] grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-[0.5625rem] gap-y-1.5 border border-grid bg-cream px-4 pt-[0.8125rem] pb-3">
        <span className={cn(EYEBROW_CLASS, "text-ash")}>
          {String(number).padStart(2, "0")}
        </span>

        <h2 className="font-urbanist truncate text-[1.1875rem] leading-none font-bold text-ink">
          {name}
        </h2>

        <p
          className={cn(
            EYEBROW_CLASS,
            "col-start-2 row-start-2 flex min-h-[1.1875rem] min-w-0 items-center gap-2 self-end text-ash",
          )}
        >
          <span className="truncate">{category}</span>

          {award && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-well px-[0.5625rem] py-1 leading-[0.6875rem] font-bold text-cream">
              <AwardIcon className="mr-[0.3125rem] h-[0.6875rem] w-[0.6875rem]" />
              <span className="translate-y-px">{award.description}</span>
            </span>
          )}
        </p>
      </div>
    </article>
  );
};

export default ProjectTile;
