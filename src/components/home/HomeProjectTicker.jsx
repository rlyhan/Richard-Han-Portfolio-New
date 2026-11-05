import cn from "classnames";
import MattedShot from "../common/MattedShot";
import PROJECTS from "../../data/projects.data";
import { fitOf } from "../../data/shots.data";

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

// Each row is drawn twice and travels half its own width, so the loop has no seam.
const HomeProjectTicker = () => (
  <div className="flex h-full flex-col gap-1">
    {ROWS.map((projects, row) => (
      <div key={row} className="min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "flex h-full w-max animate-ticker motion-reduce:animate-none",
            row === 1 && "[animation-direction:reverse]",
          )}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex h-full gap-1 pr-1">
              {projects.map(({ id, images: [src] }, i) => (
                <Tile
                  key={id}
                  src={src}
                  aspect={ASPECTS[(i + row * 2) % ASPECTS.length]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default HomeProjectTicker;
