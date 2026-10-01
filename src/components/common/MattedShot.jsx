import cn from "classnames";
import { SHOT_HEIGHT, SHOT_WIDTH } from "../../data/shots.data";

// A project shot in its frame. Two fits, and which one a shot takes is a fact about
// the artwork rather than a choice the card makes — see shots.data:
//
//   mat    the default. A mockup rendered on transparency, contained whole on the
//          frame's own ground — see HomeProjectCard for why matting is the point
//          rather than a shortfall.
//   bleed  a mockup rendered as a photograph, the device standing somewhere. It
//          arrives with a ground of its own, so there is nothing to mat it against:
//          matting one puts a second ground around a picture that already has one.
//          It covers the frame instead and the frame crops it.
//
// A bleed shot is pinned to the height of its frame and centred on it, and whatever
// width that leaves over is cropped off either side. So the shot is the same height
// at every viewport: the device sits at one point down the frame whatever the frame's
// width, which is what keeps it clear of the caption plate — a narrower frame spends
// the room around the device rather than the device's feet. The only crop that takes
// the top and bottom is a frame wider than the shot itself, where covering it is all
// that's left.
//
// `zoom` is optional: the scale classes for a hover zoom, with the
// transition and its prefers-reduced-motion guard supplied here so every caller
// gets the same one. Left off where a shot shouldn't move on hover — the
// carousel's slides, mid-swipe.
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
