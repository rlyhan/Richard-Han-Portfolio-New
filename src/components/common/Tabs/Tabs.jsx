
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TabButton from "./TabButton";
import TabContent from "./TabContent";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

export default function Tabs({
    tabs,                 // [{ id, tabName, useGrid?, render? or children }]
    ariaLabel,           // for accessibility
    defaultTabId,         // optional
    keepStableHeight = true,
    className = "",
}) {
    const firstId = tabs?.[0]?.id;
    const initial = defaultTabId ?? firstId;

    const [activeTab, setActiveTab] = useState(initial);

    const wrapRef = useRef(null);
    const panelRefs = useRef({}); // { [id]: HTMLElement }

    // Every panel is mounted at once and the inactive ones are display:none, so
    // this is pointed at the wrapper holding all of them rather than at any one
    // panel — the reveal filters the hidden ones out itself. Keyed on activeTab
    // because a switch changes which items have a layout to be measured against,
    // and the panel taking over has never been measured at all.
    useScrollReveal(wrapRef, activeTab);

    const measure = () => {
        if (!keepStableHeight) return;

        const maxH = Math.max(
            ...tabs.map((t) => panelRefs.current[t.id]?.offsetHeight ?? 0),
            0
        );

        if (wrapRef.current && maxH) {
            wrapRef.current.style.minHeight = `${maxH}px`;
        }
    };

    useLayoutEffect(() => {
        measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, tabs]);

    // Ensure activeTab remains valid if tabs change
    useEffect(() => {
        if (!tabs.some((t) => t.id === activeTab)) {
            setActiveTab(firstId);
        }
    }, [tabs, activeTab, firstId]);

    return (
        <div className={className}>
            {/* Pulled out to the viewport edges on small screens, cancelling the
                page gutter on main, so the row scrolls off the edge of the
                screen instead of being cut off at the gutter. The padding puts
                back what the margin took, keeping the first and last button
                lined up with the content either side of them when the row is
                at rest. Only below md — above it the row fits. */}
            <div className="relative -mx-8 md:mx-0">
                <div role="tablist" className="flex gap-2 md:gap-4 mb-12 overflow-x-auto no-scrollbar px-8 md:px-0" aria-label={ariaLabel}>
                    {tabs.map((t) => (
                        <TabButton
                            key={t.id}
                            id={t.id}
                            tabName={t.tabName}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    ))}
                </div>
                <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-carbon-900 to-transparent md:hidden"
                ></div>
            </div>

            <div ref={wrapRef} className="relative">
                {tabs.map((t) => (
                    <TabContent
                        key={t.id}
                        id={t.id}
                        activeTab={activeTab}
                        useGrid={!!t.useGrid}
                        ref={(el) => {
                            if (el) panelRefs.current[t.id] = el;
                        }}
                    >
                        {typeof t.render === "function" ? t.render() : t.children}
                    </TabContent>
                ))}
            </div>
        </div>
    );
}
