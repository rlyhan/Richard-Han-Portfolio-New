import cn from "classnames";
import MattedShot from "../common/MattedShot";
import { PROJECT_LINK_CLASS } from "../layout/sharedClasses";
import PROJECTS from "../../data/projects.data";
import { fitOf } from "../../data/shots.data";
import { useNavLink } from "../../hooks/useNavLinks";
import { projectPathOf } from "../../routes/routes";

const ROW_COUNT = 3;

const ASPECTS = [
  "aspect-[4/3]",
  "aspect-video",
  "aspect-square",
  "aspect-[3/2]",
  "aspect-[5/4]",
];

const ROWS = Array.from({ length: ROW_COUNT }, (_, row) =>
  PROJECTS.filter((_, i) => i % ROW_COUNT === row),
);

// Eager: a lazy image in a sideways track arrives blank as it scrolls into view.
const Tile = ({ src, aspect }) => (
  <div className={cn("relative h-full shrink-0 overflow-hidden", aspect)}>
    <MattedShot src={src} alt="" eager fit={fitOf(src)} />
  </div>
);

const LinkedTile = ({ project: { id, name, images }, aspect, isRepeat }) => {
  const link = useNavLink(projectPathOf(id));
  const [src] = images;

  return (
    <a
      {...link}
      aria-label={name}
      tabIndex={isRepeat ? -1 : undefined}
      className={cn(
        PROJECT_LINK_CLASS,
        "relative shrink-0 overflow-hidden",
        aspect,
      )}
    >
      <MattedShot src={src} alt="" eager fit={fitOf(src)} />
      <span className="absolute inset-0 bg-slate/15 transition-opacity dark:bg-slate/30 duration-500 ease-out group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none" />
    </a>
  );
};

// Each row is drawn twice and travels half its own width, so the loop has no seam.
// The repeat exists only for that, so it is kept from screen readers and the tab order.
const HomeProjectTicker = ({ linked }) => (
  <div className="flex h-full flex-col gap-1">
    {ROWS.map((projects, row) => (
      <div key={row} className="min-h-0 flex-1 overflow-clip">
        <div
          className={cn(
            "flex h-full w-max animate-ticker motion-reduce:animate-none",
            row === 1 && "[animation-direction:reverse]",
          )}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex h-full gap-1 pr-1"
            >
              {projects.map((project, i) => {
                const aspect = ASPECTS[(i + row * 2) % ASPECTS.length];

                return linked ? (
                  <LinkedTile
                    key={project.id}
                    project={project}
                    aspect={aspect}
                    isRepeat={copy === 1}
                  />
                ) : (
                  <Tile
                    key={project.id}
                    src={project.images[0]}
                    aspect={aspect}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default HomeProjectTicker;
