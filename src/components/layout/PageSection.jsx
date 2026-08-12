import cn from "classnames";

const PageSection = ({ id, children, additionalClasses }) => {
    return (
        <section
            id={id}
            // scroll-mt is not layout — nothing here moves. It's the extra room left
            // above a section when navigated to, read by helpers/sectionScroll on top
            // of the header bar's height. Small screens only: the bar is a fixed 72px
            // there against the shortest viewport, so the heading lands tighter.
            className={cn("w-full pt-18 md:pt-20 scroll-mt-10 md:scroll-mt-0", {
                [additionalClasses]: additionalClasses
            })}
        >
            {children}
        </section>
    )
}

export default PageSection
