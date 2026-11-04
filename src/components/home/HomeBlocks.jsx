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

// The first projects' shots, which index.html preloads.
const EAGER_STRIPS = 3;

// The shot keeps its full size throughout, centred in a window that opens over it,
// so a hover uncovers the picture rather than rescaling it.
const Strip = ({ project: { id, name, images }, eager }) => {
  const link = useNavLink(projectPathOf(id));
  const [src] = images;

  return (
    <a
      {...link}
      className={cn(
        PROJECT_LINK_CLASS,
        "relative min-h-0 flex-1 bg-block-projects text-slate transition-[flex-grow,flex-basis] duration-500 ease-out hover:grow-0 hover:basis-[min(calc(56.25cqw+3rem),70cqh)] focus-visible:grow-0 focus-visible:basis-[min(calc(56.25cqw+3rem),70cqh)] motion-reduce:transition-none",
      )}
    >
      <span className="absolute inset-x-0 bottom-0 flex h-12 items-center px-block-gutter font-arial text-[clamp(1rem,1.35vw,1.2rem)] leading-none">
        {name}
      </span>
      <span className="absolute inset-0 overflow-hidden transition-[bottom] duration-500 ease-out group-hover:bottom-12 group-focus-visible:bottom-12 motion-reduce:transition-none">
        <span className="absolute inset-x-0 top-1/2 block aspect-video -translate-y-1/2">
          <MattedShot src={src} alt="" eager={eager} fit={fitOf(src)} />
        </span>
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
      <span className="flex items-center justify-between gap-3 px-block-gutter font-arial text-[clamp(1.75rem,2.7vw,2.75rem)] leading-none font-normal tracking-[-0.025em]">
        <span className="transition-opacity duration-200 group-hover:opacity-60 motion-reduce:transition-none">
          {label}
        </span>
        <ArrowUpRightIcon className="h-[0.8em] w-[0.8em] shrink-0 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none" />
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
          "flex min-h-0 flex-1 flex-col [container-type:size]",
          REVEAL_CLASS,
        )}
      >
        {PROJECTS.map((project, i) => (
          <Strip key={project.id} project={project} eager={i < EAGER_STRIPS} />
        ))}
      </div>

      <Block
        to={PATHS.projects}
        label="Projects"
        index={0}
        className="bg-block-projects pt-block-gutter text-slate"
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
