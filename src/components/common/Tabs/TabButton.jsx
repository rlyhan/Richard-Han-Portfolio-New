const TabButton = ({ id, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;

    return (
        <button
            type="button"
            role="tab"
            aria-label={tabName}
            aria-selected={isActive}
            onClick={() => setActiveTab(id)}
            // Three distinct states, so hover never impersonates selection:
            // unselected is a fully neon outline over the bare page, hover washes
            // the inside and steps up to the brighter accent, selected inverts to
            // the solid fill. Hover can't just fill in — that would be the selected
            // state, and hovering an inactive tab would read as having selected it.
            // The border stays on BOTH states — dropping it from the active tab
            // shrinks its box by 2px and the whole row jumps as you switch.
            className={`grid items-center text-sm md:text-base border transition-colors px-4 py-2 rounded-md ${isActive
                ? "bg-neon border-neon text-carbon-950"
                : "bg-transparent border-neon text-neon hover:bg-neon/10 hover:border-neon-400 hover:text-neon-400"
                }`}
        >
            {/* Same trick as the border above, for weight: bold glyphs are wider
                than regular, so letting only the selected tab go semibold widened
                its box and shunted every tab after it along. An invisible bold
                copy holds the button at its widest size in both states, and the
                real label is stacked on top of it in the same grid cell. */}
            <span aria-hidden="true" className="col-start-1 row-start-1 invisible font-semibold">
                {tabName}
            </span>
            <span className={`col-start-1 row-start-1 ${isActive ? "font-semibold" : ""}`}>
                {tabName}
            </span>
        </button>
    );
};

export default TabButton;
