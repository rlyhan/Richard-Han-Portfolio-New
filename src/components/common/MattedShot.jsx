import cn from "classnames";
import { shotOf } from "../../data/shots.data";

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
//
// `sizes` is not optional, and it is the caller's to state rather than this
// component's to assume: the frames differ by a factor of three, and a srcset
// without a sizes has the browser pick for the whole viewport and fetch the top of
// the ladder every time. A bleed shot is the case that catches people out — it is
// pinned to the frame's HEIGHT and cropped either side, so what has to be stated is
// that height times this artwork's 16:9, which at every breakpoint comes out wider
// than the frame itself.
const MattedShot = ({
  src,
  alt,
  width,
  height,
  eager,
  sizes,
  fit = "mat",
  zoom,
  className,
}) => (
  <img
    {...shotOf(src)}
    sizes={sizes}
    alt={alt}
    width={width}
    height={height}
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
