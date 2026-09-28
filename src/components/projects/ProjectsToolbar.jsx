import cn from "classnames";

// The filters and the count, on one rule above the grid.
//
// The filters are a pressed-button group rather than a tablist. There is one panel
// and it is the page — a tablist would promise a screen reader that each button
// reveals a region of its own, where all three fill the same grid. `aria-pressed`
// says what these actually do: narrow what is already on screen.
//
// The count is the other half of the rule, and the reason the filters need no empty
// state of their own — it is what tells the viewer that a filter took the list from
// fourteen to three. aria-live, because the change happens below the button pressed
// and off the reading position.
//
// rounded-none on the buttons is not a style choice being restated: index.css gives
// every button an 8px radius in its base layer, and this page's controls are square.
const ProjectsToolbar = ({ rowRef, filters, activeFilter, onSelect, shown, total }) => (
  <div
    ref={rowRef}
    className="flex items-center justify-between gap-4 border-b border-grid px-[1.4rem] py-3.5 md:px-[clamp(1.75rem,3.2vw,3.5rem)]"
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
              "rounded-none border px-4 py-2 font-epilogue text-[0.6875rem] leading-none font-medium tracking-[0.06em] uppercase transition-colors duration-200 focus-visible:outline-ink motion-reduce:transition-none",
              isActive
                ? "border-ink bg-ink text-cream"
                : "border-grid bg-transparent text-ash hover:border-ash hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>

    <p
      aria-live="polite"
      className="font-epilogue text-[0.6875rem] leading-none font-medium tabular-nums text-ash"
    >
      {String(shown).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
  </div>
);

export default ProjectsToolbar;
