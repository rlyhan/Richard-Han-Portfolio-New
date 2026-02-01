import { forwardRef } from "react";

const TabContent = forwardRef(function TabContent(
    { id, activeTab, useGrid = false, children },
    ref
) {
    const isActive = activeTab === id;

    const className = useGrid
        ? `grid grid-cols-3 gap-4 ${isActive ? "block" : "hidden"}`
        : `${isActive ? "block" : "hidden"}`;

    return (
        <div
            ref={ref}
            role="tabpanel"
            id={id}
            aria-labelledby={`tab-${id}`}
            className={className}
        >
            {children}
        </div>
    );
});

export default TabContent;
