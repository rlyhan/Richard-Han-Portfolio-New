
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import TabButton from "./TabButton";
import TabContent from "./TabContent";

export default function Tabs({
    tabs,                 // [{ id, tabName, useGrid?, render? or children }]
    defaultTabId,         // optional
    keepStableHeight = true,
    className = "",
}) {
    const firstId = tabs?.[0]?.id;
    const initial = defaultTabId ?? firstId;

    const [activeTab, setActiveTab] = useState(initial);

    const wrapRef = useRef(null);
    const panelRefs = useRef({}); // { [id]: HTMLElement }

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
            <div role="tablist" className="flex gap-4 mb-6">
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
