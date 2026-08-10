import cn from "classnames";

const PageSection = ({ id, children, additionalClasses }) => {
    return (
        <section
            id={id}
            className={cn("w-full pt-18 md:pt-20", {
                [additionalClasses]: additionalClasses
            })}
        >
            {children}
        </section>
    )
}

export default PageSection
