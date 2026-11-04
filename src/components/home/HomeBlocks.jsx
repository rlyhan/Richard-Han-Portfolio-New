import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import MattedShot from "../common/MattedShot";
import { PROJECT_LINK_CLASS } from "../layout/sharedClasses";
import PROJECTS from "../../data/projects.data";
import { fitOf } from "../../data/shots.data";
import { useNavLink } from "../../hooks/useNavLinks";
import { PATHS, projectPathOf } from "../../routes/routes";

const REVEAL_CLASS = "animate-project-reveal motion-reduce:animate-none";
const REVEAL_STAGGER_MS = 120;

const LABEL_SIZE_CLASS = "text-[clamp(1.75rem,2.7vw,2.75rem)]";
const ARROW_SIZE_CLASS = "h-[0.8em] w-[0.8em] shrink-0";

const ANCHOR = "col-span-2 row-span-4";
const UPRIGHT = "row-span-6";
const STACKED = "row-span-3";

// Hand-placed on a 2 by 16 grid: each span suits the device in the shot, and the
// order is what packs them with no holes. The eager three are the ones index.html
// preloads.
const MOSAIC = [
  { id: "thakeham", span: ANCHOR, eager: true },
  { id: "neat-places", span: UPRIGHT, eager: true },
  { id: "touchgrass", span: UPRIGHT, eager: true },
  { id: "the-physics-room", span: STACKED },
  { id: "study-with-nz", span: UPRIGHT },
  { id: "deadly-ponies", span: STACKED },
];

const MosaicTile = ({ id, span, eager }) => {
  const link = useNavLink(projectPathOf(id));
  const { name, images } = PROJECTS.find((project) => project.id === id);
  const [src] = images;

  return (
    <a
      {...link}
      aria-label={`View the ${name} project`}
      className={cn(PROJECT_LINK_CLASS, "relative overflow-hidden", span)}
    >
      <MattedShot src={src} alt="" eager={eager} fit={fitOf(src)} />
      <span
        className={cn(
          "absolute inset-0 flex items-end justify-end bg-slate/50 p-block-gutter text-chalk opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none",
          LABEL_SIZE_CLASS,
        )}
      >
        <ArrowUpRightIcon
          className={cn(
            ARROW_SIZE_CLASS,
            "translate-y-[0.75em] transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none",
          )}
        />
      </span>
    </a>
  );
};

const Block = ({ to, label, index, className }) => {
  const link = useNavLink(to);

  return (
    <a
      {...link}
      className={cn(
        "group flex flex-col justify-end pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)] focus-visible:outline-current focus-visible:-outline-offset-4",
        REVEAL_CLASS,
        className,
      )}
      style={{ animationDelay: `${index * REVEAL_STAGGER_MS}ms` }}
    >
      <span
        className={cn(
          "flex items-center justify-between gap-3 px-block-gutter font-arial leading-none font-normal tracking-[-0.025em]",
          LABEL_SIZE_CLASS,
        )}
      >
        <span className="underline-offset-[0.12em] group-hover:underline">
          {label}
        </span>
        <ArrowUpRightIcon
          className={cn(
            ARROW_SIZE_CLASS,
            "transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none",
          )}
        />
      </span>
    </a>
  );
};

const HomeBlocks = () => (
  <nav
    aria-label="Pages"
    className="grid h-full min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] grid-rows-2"
  >
    <div className="row-span-2 flex min-h-0 flex-col">
      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-2 grid-rows-16",
          REVEAL_CLASS,
        )}
      >
        {MOSAIC.map((tile) => (
          <MosaicTile key={tile.id} {...tile} />
        ))}
      </div>

      <Block
        to={PATHS.projects}
        label="Projects"
        index={0}
        className="bg-block-projects pt-block-gutter text-ink"
      />
    </div>

    <Block
      to={PATHS.about}
      label="About"
      index={1}
      className="bg-block-about text-slate"
    />

    <Block
      to={PATHS.contact}
      label="Contact"
      index={2}
      className="bg-block-contact text-chalk"
    />
  </nav>
);

export default HomeBlocks;
