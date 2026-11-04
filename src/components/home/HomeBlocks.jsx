import cn from "classnames";
import MattedShot from "../common/MattedShot";
import { fitOf } from "../../data/shots.data";
import { useNavLink } from "../../hooks/useNavLinks";
import { PATHS } from "../../routes/routes";

const REVEAL_STAGGER_MS = 120;

const ANCHOR = "col-span-2 row-span-4";
const UPRIGHT = "row-span-6";
const STACKED = "row-span-3";

// Hand-placed on a 2 by 16 grid: each span suits the device in the shot, and the
// order is what packs them with no holes. The eager three are the ones index.html
// preloads.
const MOSAIC = [
  { src: "thakeham.webp", span: ANCHOR, eager: true },
  { src: "neatplaces.webp", span: UPRIGHT, eager: true },
  { src: "touchgrass.webp", span: UPRIGHT, eager: true },
  { src: "physicsroom.webp", span: STACKED },
  { src: "studywithnz.webp", span: UPRIGHT },
  { src: "deadlyponies.webp", span: STACKED },
];

const Block = ({ to, label, index, className, children }) => {
  const link = useNavLink(to);

  return (
    <a
      {...link}
      className={cn(
        "group flex animate-project-reveal flex-col justify-end pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)] focus-visible:outline-current focus-visible:-outline-offset-4 motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${index * REVEAL_STAGGER_MS}ms` }}
    >
      {children}
      <span className="px-block-gutter font-arial text-[clamp(1.75rem,2.7vw,2.75rem)] leading-none font-normal tracking-[-0.025em] underline-offset-[0.12em] group-hover:underline">
        {label}
      </span>
    </a>
  );
};

const HomeBlocks = () => (
  <nav
    aria-label="Pages"
    className="grid h-full min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] grid-rows-2"
  >
    <Block
      to={PATHS.projects}
      label="Projects"
      index={0}
      className="row-span-2 min-h-0 bg-block-projects text-ink"
    >
      <div className="mb-block-gutter grid min-h-0 flex-1 grid-cols-2 grid-rows-16">
        {MOSAIC.map(({ src, span, eager }) => (
          <div key={src} className={cn("relative overflow-hidden", span)}>
            <MattedShot src={src} alt="" eager={eager} fit={fitOf(src)} />
          </div>
        ))}
      </div>
    </Block>

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
