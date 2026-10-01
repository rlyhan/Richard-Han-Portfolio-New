import cn from "classnames";

// The page frame every section sits in: the shared gutter, the max width, and the
// clearance above a heading. `contained: false` opts a section out of all three —
// the hero is the one that runs to the viewport edge and starts at the very top.
const PageSection = ({ id, children, additionalClasses, contained = true }) => {
    // scroll-mt-10/scroll-mt-0 is read by helpers/sectionScroll on top of the
    // header bar's height — change it there too.
    return (
        <section
            id={id}
            className={cn("w-full scroll-mt-10 md:scroll-mt-0", {
                "pt-18 md:pt-20": contained,
                [additionalClasses]: additionalClasses
            })}
        >
            {contained
                ? <div className="w-full max-w-7xl mx-auto px-8 md:px-12">{children}</div>
                : children}
        </section>
    )
}

export default PageSection
