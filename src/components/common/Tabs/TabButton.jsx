const TabButton = ({ id, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;

    return (
        <button
            type="button"
            role="tab"
            aria-label={tabName}
            aria-selected={isActive}
            onClick={() => setActiveTab(id)}
            className={`text-sm md:text-base border transition-colors px-4 py-2 rounded-md ${isActive
                ? "bg-yellow-300 text-gray-900 border-yellow-300"
                : "bg-white/10 border-white/10 hover:text-yellow-300"
                }`}
        >
            {tabName}
        </button>
    );
};

export default TabButton;
