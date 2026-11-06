import cn from "classnames";
import ArrowUpRightIcon from "../icons/ArrowUpRightIcon";
import ProjectTicker from "../common/ProjectTicker";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useNavLink } from "../../hooks/useNavLinks";
import { NAV_ROUTES, PATHS } from "../../routes/routes";

const REVEAL_CLASS = "animate-project-reveal motion-reduce:animate-none";
const REVEAL_STAGGER_MS = 120;

// md, as Tailwind has it. Read from JS rather than hidden with CSS, because an image
// under display: none can still download, and the ticker is drawn in a different
// place at each size.
export const MD_UP = "(min-width: 768px)";

// The nav bar's numbering, so a page has the same number here as in the bar.
const numberOf = (path) =>
  String(NAV_ROUTES.findIndex((route) => route.path === path) + 1).padStart(
    2,
    "0",
  );

const Block = ({ to, label, index, isArrowAtTop, className }) => {
  const link = useNavLink(to);

  return (
    <a
      {...link}
      className={cn(
        "group relative flex flex-col justify-end border-t border-grid bg-fog pt-6 pb-6 text-ink transition-[filter] duration-200 hover:brightness-[0.92] focus-visible:outline-current focus-visible:-outline-offset-4 focus-visible:brightness-[0.92] motion-reduce:transition-none md:border-0 md:text-slate md:pb-block-foot",
        REVEAL_CLASS,
        className,
      )}
      style={{ animationDelay: `${index * REVEAL_STAGGER_MS}ms` }}
    >
      <span className="flex items-center justify-between gap-1 pr-2.5 pl-[1.4rem] font-arial text-[1rem] leading-none font-normal tracking-[-0.025em] md:gap-3 md:px-block-gutter md:text-[clamp(1.75rem,2.7vw,2.75rem)]">
        <span className="flex items-baseline md:gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "hidden opacity-50 md:block",
              isArrowAtTop && "md:absolute md:top-block-gutter md:left-block-gutter",
            )}
          >
            {numberOf(to)}
          </span>
          <span className="transition-opacity duration-200 group-hover:opacity-60 motion-reduce:transition-none">
            {label}
          </span>
        </span>
        <ArrowUpRightIcon
          className={cn(
            "h-[0.8em] w-[0.8em] shrink-0 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none",
            isArrowAtTop && "md:absolute md:top-block-gutter md:right-block-gutter",
          )}
        />
      </span>
    </a>
  );
};

// The right half of the hero, and below md what sits under the intro.
//
// `setPanelRef` hands the whole panel to the hero's exit as one plane — see Home.
const HomeBlocks = ({ setPanelRef, cue }) => {
  const isMdUp = useMediaQuery(MD_UP);

  return (
    <section className="relative border-grid md:col-start-2 md:row-span-2 md:row-start-1 md:h-full md:min-h-0 md:overflow-hidden md:border-l">
      {cue && (
        <div className="absolute right-[1.4rem] bottom-full mb-3">{cue}</div>
      )}

      <nav
        ref={setPanelRef}
        aria-label="Portfolio sections"
        className="h-full min-h-0"
      >
        <ul className="grid h-full min-h-0 grid-cols-3 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:grid-rows-2">
          <li className="order-2 flex min-h-0 flex-col md:order-none md:row-span-2">
            {isMdUp && (
              <div className={cn("min-h-0 flex-1 bg-fog", REVEAL_CLASS)}>
                <ProjectTicker linked />
              </div>
            )}

            <Block
              to={PATHS.projects}
              label="Projects"
              index={0}
              className="grow border-l md:grow-0 md:bg-block-projects md:pt-block-gutter"
            />
          </li>

          <li className="order-1 grid md:order-none">
            <Block
              to={PATHS.about}
              label="About"
              index={1}
              isArrowAtTop
              className="md:bg-block-about md:pt-0 md:dark:text-chalk"
            />
          </li>

          <li className="order-3 grid md:order-none">
            <Block
              to={PATHS.contact}
              label="Contact"
              index={2}
              isArrowAtTop
              className="border-l md:bg-block-contact md:pt-0 md:dark:text-chalk"
            />
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default HomeBlocks;
