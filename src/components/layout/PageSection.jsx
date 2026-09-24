import cn from "classnames";

// The page frame every section sits in: the shared gutter, the max width, and the
// clearance above a heading. `contained: false` opts a section out of all three —
// the hero is the one that runs to the viewport edge and starts at the very top.
const PageSection = ({ id, children, additionalClasses, contained = true }) => {
    return (
        <section
            id={id}
            // scroll-mt is not layout — nothing here moves. It's the extra room left
            // above a section when navigated to, read by helpers/sectionScroll on top
            // of the header bar's height. Small screens only: the bar is a fixed 72px
            // there against the shortest viewport, so the heading lands tighter.
            className={cn("w-full scroll-mt-10 md:scroll-mt-0", {
                "pt-18 md:pt-20": contained,
                [additionalClasses]: additionalClasses
            })}
        >
            {/* The frame is a wrapper rather than padding on the section itself, so a
                section's own background still runs the full width of the page — which
                is what lets About cover the full-bleed hero behind it. */}
            {contained
                ? <div className="w-full max-w-7xl mx-auto px-8 md:px-12">{children}</div>
                : children}
        </section>
    )
}

export default PageSection
