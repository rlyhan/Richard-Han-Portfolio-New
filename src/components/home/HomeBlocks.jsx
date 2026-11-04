import cn from "classnames";
import MattedShot from "../common/MattedShot";
import { fitOf } from "../../data/shots.data";
import { useNavLink } from "../../hooks/useNavLinks";
import { PATHS } from "../../routes/routes";

const REVEAL_STAGGER_MS = 120;

const WIDE = "col-span-2";
const UPRIGHT = "col-span-2 row-span-2";
const ANCHOR = "col-span-4 row-span-2";

// Hand-placed on a 4 by 9 grid: each span suits the device in the shot, and the
// order is what packs them with no holes, so a new project needs a place here.
// The eager three are the ones index.html preloads.
const MOSAIC = [
  { src: "neatplaces.webp", span: UPRIGHT, eager: true },
  { src: "gnetwork.webp", span: WIDE },
  { src: "deadlyponies.webp", span: WIDE },
  { src: "thakeham.webp", span: ANCHOR, eager: true },
  { src: "gigsoflondon.webp", span: WIDE },
  { src: "touchgrass.webp", span: UPRIGHT, eager: true },
  { src: "physicsroom.webp", span: WIDE },
  { src: "coloursmith.webp", span: WIDE },
  { src: "jamesdunlop.webp", span: WIDE },
  { src: "studywithnz.webp", span: UPRIGHT },
  { src: "ecc.webp", span: WIDE },
  { src: "westcoasttas.webp", span: WIDE },
];

const Block = ({ to, label, index, className, children }) => {
  const link = useNavLink(to);

  return (
    <a
      {...link}
      className={cn(
        "group flex animate-project-reveal flex-col justify-end px-block-gutter pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)] focus-visible:outline-current focus-visible:-outline-offset-4 motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${index * REVEAL_STAGGER_MS}ms` }}
    >
      {children}
      <span className="font-arial text-[clamp(1.75rem,2.7vw,2.75rem)] leading-none font-normal tracking-[-0.025em] underline-offset-[0.12em] group-hover:underline">
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
      className="row-span-2 min-h-0 bg-block-projects pt-block-gutter text-ink"
    >
      <div className="mb-block-gutter grid min-h-0 flex-1 grid-flow-dense grid-cols-4 grid-rows-9 gap-1">
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
