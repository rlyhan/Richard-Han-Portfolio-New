import cn from "classnames";

// A project shot, contained rather than cropped inside its frame — see
// HomeProjectCard for why matting is the point rather than a shortfall. Shared by
// HomeProjectCard and ProjectTile, the hero's cells and the Projects grid's.
//
// `zoom` is optional: the scale classes for a hover zoom, with the
// transition and its prefers-reduced-motion guard supplied here so every caller
// gets the same one. Left off where a shot shouldn't move on hover — the
// carousel's slides, mid-swipe.
const MattedShot = ({ src, alt, width, height, eager, zoom, className }) => (
  <img
    src={`/images/projects/${src}`}
    alt={alt}
    width={width}
    height={height}
    loading={eager ? "eager" : "lazy"}
    fetchPriority={eager ? "high" : undefined}
    decoding="async"
    className={cn(
      "block h-full w-full object-contain object-center",
      zoom &&
        cn(
          "transition-transform duration-500 motion-reduce:transition-none",
          zoom,
        ),
      className,
    )}
  />
);

export default MattedShot;
