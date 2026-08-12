import { forwardRef } from "react";

const TabContent = forwardRef(function TabContent(
    { id, activeTab, useGrid = false, children },
    ref
) {
    const isActive = activeTab === id;

    // Only the incoming panel fades; the outgoing one is cut immediately so the two
    // never overlap and shove each other around in the flow.
    //
    // An animation, not a transition: the flip from display:none to block is what
    // restarts it, and a transition can't fire on an element that arrives already at
    // its final opacity.
    const visibility = isActive
        ? "block motion-safe:animate-tab-fade-in"
        : "hidden";

    const className = useGrid
        ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${visibility}`
        : `flex flex-col gap-12 ${visibility}`;

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
