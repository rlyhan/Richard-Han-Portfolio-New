import cn from "classnames";

const PageSection = ({ id, children, additionalClasses }) => {
    return (
        <section
            id={id}
            className={cn("w-full min-h-screen pt-24", {
                [additionalClasses]: additionalClasses
            })}
        >
            {children}
        </section>
    )
}

export default PageSection
