import cn from "classnames";
import LocationPinIcon from "../icons/LocationPinIcon";
import ThemeToggle from "../common/Buttons/ThemeToggle";
import { INTRO_TOPLINE } from "../../data/home.data";
import { EYEBROW_LABEL_CLASS } from "./sharedClasses";

// The masthead line above every page's heading but a write-up's: the location, and
// the theme toggle opposite it.
const Byline = ({ topLineRef }) => (
  <div
    ref={topLineRef}
    className={cn(
      "flex items-center justify-between gap-4",
      EYEBROW_LABEL_CLASS,
    )}
  >
    <span className="flex items-center gap-2">
      <LocationPinIcon className="size-3 shrink-0" />
      <span className="translate-y-px">{INTRO_TOPLINE.location}</span>
    </span>
    <ThemeToggle />
  </div>
);

export default Byline;
