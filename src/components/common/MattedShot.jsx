import cn from "classnames";
import { SHOT_HEIGHT, SHOT_WIDTH } from "../../data/shots.data";

// A project shot in its frame. Which fit it takes (`mat` or `bleed`) is a fact
// about the artwork, not a choice the card makes — see shots.data.
//
// `zoom` is optional: the scale classes for a hover zoom, with the transition
// and its prefers-reduced-motion guard supplied here so every caller gets the
// same one. Left off where a shot shouldn't move on hover — the carousel's
// slides, mid-swipe.
const MattedShot = ({ src, alt, eager, fit = "mat", zoom, className }) => (
  <img
    src={`/images/projects/${src}`}
    alt={alt}
    width={SHOT_WIDTH}
    height={SHOT_HEIGHT}
    loading={eager ? "eager" : "lazy"}
    fetchPriority={eager ? "high" : undefined}
    decoding="async"
    className={cn(
      "h-full object-center",
      fit === "bleed"
        ? "absolute top-0 left-1/2 w-auto max-w-none min-w-full -translate-x-1/2 object-cover"
        : "block w-full object-contain",
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
