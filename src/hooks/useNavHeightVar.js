import { useEffect, useRef } from "react";

// The pinned nav bar's height, published as `--nav-height` for the document to
// reserve at its foot — see Footer, which is the room the bar is scrolled clear of.
//
// Measured rather than stated: the bar sizes from the name it carries, which is set
// in vw, so its height is a function of the viewport rather than a number a second
// file could hold. A stated number that drifts is the last row of a short page
// stuck under the bar with no scroll left to free it.
//
// Returns the ref to put on the pinned bar.
export function useNavHeightVar() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // offsetHeight, not a box: the bar is translated out of the viewport whenever
    // it is down, and a box read there is the same height at a different place.
    const publish = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${bar.offsetHeight}px`,
      );
    };

    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(bar);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--nav-height");
    };
  }, []);

  return barRef;
}
