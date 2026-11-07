import cn from "classnames";
import { PAGE_GUTTER_CLASS } from "../layout/sharedClasses";

// The filters and the count, on one rule above the grid.
//
// The filters are a pressed-button group, not a tablist: there's one panel and
// it's the page — a tablist would promise a screen reader that each button
// reveals a region of its own, where all three fill the same grid. `aria-pressed`
// says what these actually do: narrow what's already on screen.
//
// The count is the other half of the rule, and the reason the filters need no
// empty state of their own — it tells the viewer a filter took the list from
// fourteen to three. aria-live, since the change happens below the button
// pressed and off the reading position.
const ProjectsToolbar = ({ filters, activeFilter, onSelect, shown, total }) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 border-grid py-3.5",
      PAGE_GUTTER_CLASS,
    )}
  >
    <div role="group" aria-label="Filter projects" className="flex gap-2">
      {filters.map(({ id, label }) => {
        const isActive = id === activeFilter;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-none border px-4 py-2 font-arial text-[0.6875rem] leading-none tracking-[0.06em] uppercase transition-colors duration-200 focus-visible:outline-ink motion-reduce:transition-none",
              isActive
                ? "border-ink bg-ink text-cream"
                : "border-ash/70 bg-transparent text-ash hover:border-ash hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>

    <p
      aria-live="polite"
      className="font-arial text-[0.6875rem] leading-none tracking-[0.06em] tabular-nums text-ash"
    >
      {String(shown).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
  </div>
);

export default ProjectsToolbar;
