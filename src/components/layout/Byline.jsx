import cn from "classnames";
import LocationPinIcon from "../icons/LocationPinIcon";
import ThemeToggle from "../common/Buttons/ThemeToggle";
import { INTRO_TOPLINE } from "../../data/home.data";
import { EYEBROW_LABEL_CLASS } from "./sharedClasses";

// The masthead line above every page's heading but a write-up's: the location, and
// the theme toggle opposite it. On the hero the location wraps below md, to stay
// clear of the scroll cue centred in the same row.
const Byline = ({ topLineRef, wrapLocationBelowMd = false }) => (
  <div
    ref={topLineRef}
    className={cn(
      "flex items-center justify-between gap-4",
      EYEBROW_LABEL_CLASS,
    )}
  >
    <span
      className={cn(
        "flex items-center gap-2",
        wrapLocationBelowMd && "max-w-24 md:max-w-none",
      )}
    >
      <LocationPinIcon className="size-3 shrink-0" />
      <span className="translate-y-px">{INTRO_TOPLINE.location}</span>
    </span>
    <ThemeToggle />
  </div>
);

export default Byline;
