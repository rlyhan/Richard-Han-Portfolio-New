const TabButton = ({ id, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;

    return (
        <button
            type="button"
            role="tab"
            aria-label={tabName}
            aria-selected={isActive}
            onClick={() => setActiveTab(id)}
            className={`grid items-center text-sm md:text-base border transition-colors px-4 py-2 rounded-md ${isActive
                ? "bg-neon border-neon text-carbon-950"
                : "bg-transparent border-neon text-neon hover:bg-neon/10 hover:border-neon-400 hover:text-neon-400"
                }`}
        >

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
