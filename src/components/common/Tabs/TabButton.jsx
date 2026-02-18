const TabButton = ({ id, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;

    return (
        <button
            type="button"
            role="tab"
            aria-label={tabName}
            aria-selected={isActive}
            onClick={() => setActiveTab(id)}
            className={`text-sm md:text-base border transition-colors hover:border-yellow-400 px-4 py-2 rounded-md ${isActive
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-transparent border-white/20 text-white"
                }`}
        >
            {tabName}
        </button>
    );
};

export default TabButton;
