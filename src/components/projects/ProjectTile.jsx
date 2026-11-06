import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import AwardIcon from "../icons/AwardIcon";
import MattedShot from "../common/MattedShot";
import { useNavLink } from "../../hooks/useNavLinks";
import { IMAGE_FALLBACK_CLASS } from "../layout/sharedClasses";
import { projectPathOf } from "../../routes/routes";
import { fitOf } from "../../data/shots.data";

// The Projects page's small-caps voice: each tile's category, and the award mark
// beside it.
const EYEBROW_CLASS =
  "font-epilogue text-[0.625rem] font-medium uppercase leading-none tracking-[0.06em]";

// Each tile is drawn like one of the homepage's blocks: the shot in its frame, and
// under it the number and name in the blocks' Arial with the arrow opposite. Most
// shots are matted rather than cropped, and the ones photographed in a room run to
// the frame's edges instead — see shots.data.
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
      className="border-b border-grid md:max-lg:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0"
    >
      <a
        {...link}
        aria-label={`${name} — ${category}`}
        className="group block h-full focus-visible:outline-ink focus-visible:-outline-offset-4"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-frame">
          <div
            className={cn(
              "absolute overflow-hidden",
              fit === "bleed"
                ? "inset-0"
                : "inset-x-5 inset-y-4 flex items-center justify-center md:inset-x-[1.625rem] md:inset-y-5",
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
              <div aria-hidden="true" className={IMAGE_FALLBACK_CLASS} />
            )}
          </div>
        </div>

        <div className="px-[1.4rem] pt-5 pb-6 md:px-block-gutter md:pt-block-gutter md:pb-block-foot">
          <div className="flex items-center justify-between gap-3 font-arial text-[1.75rem] leading-none tracking-[-0.025em] md:text-[clamp(1.5rem,2.2vw,2.25rem)]">
            <span className="flex min-w-0 items-baseline gap-3 md:gap-4">
              <span aria-hidden="true" className="text-ash">
                {String(number).padStart(2, "0")}
              </span>
              <h2 className="truncate leading-[1.2] text-ink transition-opacity duration-200 group-hover:opacity-60 motion-reduce:transition-none">
                {name}
              </h2>
            </span>
            <ArrowUpRightIcon className="h-[0.8em] w-[0.8em] shrink-0 text-ink transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none" />
          </div>

          <p
            className={cn(
              EYEBROW_CLASS,
              "mt-4 flex min-h-[1.1875rem] min-w-0 items-center gap-2 text-ash",
            )}
          >
            <span className="truncate">{category}</span>

            {award && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-ink px-[0.5625rem] py-1 leading-[0.6875rem] font-bold text-cream">
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
