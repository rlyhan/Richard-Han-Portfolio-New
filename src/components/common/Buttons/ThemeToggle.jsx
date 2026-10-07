import cn from "classnames";
import SunIcon from "../../icons/SunIcon";
import MoonIcon from "../../icons/MoonIcon";
import { useColorScheme } from "../../../hooks/useColorScheme";

const SEGMENT_CLASS =
  "grid place-items-center px-1.5 py-1 transition-colors duration-200 motion-reduce:transition-none";

const SELECTED_CLASS = "bg-ink text-cream";

const UNSELECTED_CLASS = "text-ash group-hover:text-ink";

const ICON_CLASS = "size-3";

const ThemeToggle = () => {
  const [scheme, toggleScheme] = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={toggleScheme}
      className="group -my-1 flex shrink-0 rounded-none border border-grid p-0 focus-visible:outline-ink"
    >
      <span className={cn(SEGMENT_CLASS, isDark ? UNSELECTED_CLASS : SELECTED_CLASS)}>
        <SunIcon className={ICON_CLASS} />
      </span>
      <span className={cn(SEGMENT_CLASS, isDark ? SELECTED_CLASS : UNSELECTED_CLASS)}>
        <MoonIcon className={ICON_CLASS} />
      </span>
    </button>
  );
};

export default ThemeToggle;
