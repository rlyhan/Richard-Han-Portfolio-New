import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import MattedShot from "../common/MattedShot";
import { PROJECT_LINK_CLASS } from "../layout/sharedClasses";
import PROJECTS from "../../data/projects.data";
import { fitOf } from "../../data/shots.data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useNavLink } from "../../hooks/useNavLinks";
import { PATHS, projectPathOf } from "../../routes/routes";

const REVEAL_CLASS = "animate-project-reveal motion-reduce:animate-none";
const REVEAL_STAGGER_MS = 120;

// md, as Tailwind has it. Read from JS rather than hidden with CSS, because an image
// under display: none can still download, and each layout has strips of its own.
export const MD_UP = "(min-width: 768px)";

// The first projects' shots, which index.html preloads.
const EAGER_STRIPS = 3;

// The shot keeps its full size throughout, centred in a window that opens over it,
// so a hover uncovers the picture rather than rescaling it.
const Strip = ({ project: { id, name, images }, eager }) => {
  const link = useNavLink(projectPathOf(id));
  const [src] = images;

  return (
    <li className="relative min-h-0 flex-1 transition-[flex-grow,flex-basis] duration-500 ease-out hover:grow-0 hover:basis-[min(calc(56.25cqw+3rem),70cqh)] has-[:focus-visible]:grow-0 has-[:focus-visible]:basis-[min(calc(56.25cqw+3rem),70cqh)] motion-reduce:transition-none">
      <a
        {...link}
        className={cn(
          PROJECT_LINK_CLASS,
          "absolute inset-0 overflow-hidden bg-block-projects text-slate",
        )}
      >
        <span className="absolute inset-x-0 bottom-0 flex h-12 items-center px-block-gutter font-arial text-[clamp(1rem,1.35vw,1.2rem)] leading-none">
          {name}
        </span>
        <span className="absolute inset-0 overflow-hidden bg-block-projects transition-[bottom] duration-500 ease-out group-hover:bottom-12 group-focus-visible:bottom-12 motion-reduce:transition-none">
          <span className="absolute inset-x-0 top-1/2 block aspect-video -translate-y-1/2 opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <MattedShot src={src} alt="" eager={eager} fit={fitOf(src)} />
          </span>
        </span>
      </a>
    </li>
  );
};

const Block = ({ to, label, index, className }) => {
  const link = useNavLink(to);

  return (
    <a
      {...link}
      className={cn(
        "group flex flex-col justify-end pb-6 focus-visible:outline-current focus-visible:-outline-offset-4 md:pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)]",
        REVEAL_CLASS,
        className,
      )}
      style={{ animationDelay: `${index * REVEAL_STAGGER_MS}ms` }}
    >
      <span className="flex items-center justify-between gap-1 pr-2.5 pl-[1.4rem] font-arial text-[1rem] leading-none font-normal tracking-[-0.025em] md:gap-3 md:px-block-gutter md:text-[clamp(1.75rem,2.7vw,2.75rem)]">
        <span className="transition-opacity duration-200 group-hover:opacity-60 motion-reduce:transition-none">
          {label}
        </span>
        <ArrowUpRightIcon className="h-[0.8em] w-[0.8em] shrink-0 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none" />
      </span>
    </a>
  );
};

const HomeBlocks = () => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <nav aria-label="Portfolio sections" className="h-full min-h-0">
      <ul className="grid h-full min-h-0 grid-cols-3 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:grid-rows-2">
        <li className="order-2 flex min-h-0 flex-col md:order-none md:row-span-2">
          {isMdUp && (
            <ul
              aria-label="Projects"
              className={cn(
                "flex min-h-0 flex-1 flex-col [container-type:size]",
                REVEAL_CLASS,
              )}
            >
              {PROJECTS.map((project, i) => (
                <Strip
                  key={project.id}
                  project={project}
                  eager={i < EAGER_STRIPS}
                />
              ))}
            </ul>
          )}

          <Block
            to={PATHS.projects}
            label="Projects"
            index={0}
            className="grow border-t border-l border-grid bg-fog pt-6 text-ink md:grow-0 md:border-0 md:bg-block-projects md:pt-block-gutter md:text-slate"
          />
        </li>

        <li className="order-1 grid md:order-none">
          <Block
            to={PATHS.about}
            label="About"
            index={1}
            className="border-t border-grid bg-fog pt-6 text-ink md:border-0 md:bg-block-about md:pt-0 md:text-slate"
          />
        </li>

        <li className="order-3 grid md:order-none">
          <Block
            to={PATHS.contact}
            label="Contact"
            index={2}
            className="border-t border-l border-grid bg-fog pt-6 text-ink md:border-0 md:bg-block-contact md:pt-0 md:text-chalk"
          />
        </li>
      </ul>
    </nav>
  );
};

export default HomeBlocks;
