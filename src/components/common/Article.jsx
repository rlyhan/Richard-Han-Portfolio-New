import List from "./List"
import IconRenderer from "../icons/IconRenderer"

const Article = ({ item, icon, backgroundColor, containerStyles, textStyles, includeHeaderIcon = false, useListIcons = true }) => {
    const { id, heading, listItems } = item
    return (
        <article key={id} className="flex flex-col gap-4">
            <header className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    {includeHeaderIcon && icon && <IconRenderer icon={icon} className="h-6 w-6 text-teal-500" />}
                    <h3 className="text-lg md:text-2xl font-semibold">{heading}</h3>
                </div>
                {item.subheading ? <p className="text-sm text-gray-400">
                    {item.subheading}
                </p> : <></>}
            </header>

            <List listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                icon={useListIcons && icon ? icon : null}
                backgroundColor={backgroundColor}
                containerStyles={containerStyles}
                textStyles={textStyles} />
        </article>
    )
}

export default Article