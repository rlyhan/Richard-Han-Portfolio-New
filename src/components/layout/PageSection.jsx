import cn from "classnames";

const PageSection = ({ id, children, additionalClasses }) => {
    return (
        <section
            id={id}
            // scroll-mt is not layout — nothing here moves. It is the extra room
            // left above a section when it is navigated to, read by
            // helpers/sectionScroll, on top of the header bar's own height.
            // Only on small screens: the bar is a fixed 72px there but the
            // viewport is at its shortest, so the heading lands closer to the
            // bar than it reads on a desktop screen.
            className={cn("w-full pt-18 md:pt-20 scroll-mt-10 md:scroll-mt-0", {
                [additionalClasses]: additionalClasses
            })}
        >
            {children}
        </section>
    )
}

export default PageSection
