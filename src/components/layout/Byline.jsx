import LocationPinIcon from "../icons/LocationPinIcon";
import ThemeToggle from "../common/Buttons/ThemeToggle";
import { INTRO_TOPLINE } from "../../data/home.data";

// The masthead line above every page's heading but a write-up's: the location, and
// the theme toggle opposite it.
const Byline = ({ topLineRef }) => (
  <div
    ref={topLineRef}
    className="flex items-center justify-between gap-4 font-arial text-[0.6875rem] leading-[1.25] tracking-[0.01em] text-ash uppercase"
  >
    <span className="flex items-center gap-2">
      <LocationPinIcon className="size-3 shrink-0" />
      <span className="translate-y-px">{INTRO_TOPLINE.location}</span>
    </span>
    <ThemeToggle />
  </div>
);

export default Byline;
