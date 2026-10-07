import cn from "classnames";
import LocationPinIcon from "../icons/LocationPinIcon";
import ThemeToggle from "../common/Buttons/ThemeToggle";
import { INTRO_TOPLINE } from "../../data/home.data";
import { EYEBROW_LABEL_CLASS } from "./sharedClasses";

// The name/location masthead line shared by the hero and the About page. Only the
// hero hides the name below md, which is why the location's own width cap and
// right-alignment are tied to the same flag: given the whole line to itself down
// there, it doesn't need either.
const Byline = ({ topLineRef, hideNameBelowMd = false }) => (
  <p
    ref={topLineRef}
    className={cn(
      "flex items-center justify-between gap-4",
      EYEBROW_LABEL_CLASS,
    )}
  >
    <span className={hideNameBelowMd ? "hidden md:block" : undefined}>
      {INTRO_TOPLINE.name}
    </span>
    <span className="flex items-center gap-4">
      <span
        className={cn(
          "flex items-center gap-2",
          hideNameBelowMd && "max-w-24 md:max-w-none",
        )}
      >
        <LocationPinIcon className="size-3 shrink-0" />
        <span
          className={cn(
            "translate-y-px",
            hideNameBelowMd ? "md:text-right" : "text-right",
          )}
        >
          {INTRO_TOPLINE.location}
        </span>
      </span>
      <ThemeToggle />
    </span>
  </p>
);

export default Byline;
