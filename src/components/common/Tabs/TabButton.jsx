const TabButton = ({ id, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;

    return (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`border transition-colors hover:border-yellow-300 px-4 py-2 rounded-md
        ${isActive
                    ? "bg-yellow-300 text-black border-yellow-300"
                    : "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                }`}
        >
            {tabName}
        </button>
    );
};

export default TabButton;
