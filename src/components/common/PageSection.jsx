import cn from "classnames";

const PageSection = ({ id, children, additionalClasses }) => {
    return (
        <section
            id={id}
            className={cn("w-full min-h-screen mt-24", {
                [additionalClasses]: additionalClasses
            })}
        >
            {children}
        </section>
    )
}

export default PageSection
