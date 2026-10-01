import cn from "classnames";
import AwardIcon from "../icons/AwardIcon";
import MattedShot from "../common/MattedShot";
import { useNavLink } from "../../hooks/useNavLinks";
import {
  IMAGE_FALLBACK_CLASS,
  PROJECT_LINK_CLASS,
} from "../layout/sharedClasses";
import { projectPathOf } from "../../routes/routes";
import { fitOf } from "../../data/shots.data";

// The Projects page's small-caps voice: each tile's number and category, and the
// award mark inside the category line. Tighter tracking than the hero's spread — at
// 9px in a plate this narrow, the hero's 0.18em pushes a two-word category into a
// wrap.
const EYEBROW_CLASS =
  "font-epilogue text-[0.5625rem] font-medium uppercase leading-none tracking-[0.06em]";

// The hero card's frame at three-column size — see HomeProjectCard for why most
// shots are matted rather than cropped, and why the ones photographed in a room run
// to the tile's edges instead. The ground differs at this size: `bg-frame`, a
// vignetted well rather than a flat one, since a flat fill reads as a slab this large
// (see tailwind.config). The zoom is the hero's too, held to one subtle step since a
// fourteen-cell grid only ever has one shot moving at a time under the cursor.
//
// The whole cell is the link to the project's write-up, and the plate's edge going to
// `ash` is all the hover there is — for the same reason: the affordance has to be
// something that doesn't move.
//
// The title stays a heading inside that link rather than becoming a span the link is
// named by. The list is a list of projects, and a screen reader jumping the page by
// heading is the fastest way through it; the link says what it is with its own label.
const ProjectTile = ({ project, number, eager }) => {
  const { id, name, category, award, images } = project;
  const image = images?.[0];
  const fit = image && fitOf(image);
  const link = useNavLink(projectPathOf(id));

  return (
    <article
      data-reveal
      className="relative h-[clamp(21.25rem,60vw,27.5rem)] overflow-hidden border-b border-grid bg-frame md:h-[clamp(17.5rem,44vw,25rem)] lg:h-[clamp(18.75rem,34vw,28.75rem)]"
    >
      <a
        {...link}
        aria-label={`${name} — ${category}`}
        className={PROJECT_LINK_CLASS}
      >
        <div
          className={cn(
            "absolute overflow-hidden",
            fit === "bleed"
              ? "inset-0"
              : "inset-x-5 top-3 bottom-24 flex items-center justify-center md:inset-x-[1.625rem] md:top-4",
          )}
        >
          {image ? (
            <MattedShot
              src={image}
              alt={`The ${name} site`}
              fit={fit}
              eager={eager}
              zoom="group-hover:scale-[1.05]"
            />
          ) : (
            <div
              aria-hidden="true"
              className={IMAGE_FALLBACK_CLASS}
            />
          )}
        </div>

        <div className="absolute inset-x-3.5 bottom-3.5 grid min-h-[3.625rem] grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-[0.5625rem] gap-y-1.5 border border-grid bg-cream px-4 pt-[0.8125rem] pb-3 transition-colors duration-200 group-hover:border-ash motion-reduce:transition-none">
          <span className={cn(EYEBROW_CLASS, "text-ash")}>
            {String(number).padStart(2, "0")}
          </span>

          <h2 className="font-urbanist truncate text-[1.1875rem] font-bold text-ink">
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
      </a>
    </article>
  );
};

export default ProjectTile;
