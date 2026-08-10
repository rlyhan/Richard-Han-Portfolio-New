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
            className={`text-sm md:text-base border transition-colors px-4 py-2 rounded-md ${isActive
                ? "bg-neon border-neon text-carbon-950 font-semibold"
                : "bg-transparent border-neon text-neon hover:bg-neon/10 hover:border-neon-400 hover:text-neon-400"
                }`}
        >
            {tabName}
        </button>
    );
};

export default TabButton;
