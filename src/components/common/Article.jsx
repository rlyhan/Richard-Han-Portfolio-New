import List from "./List"
import IconRenderer from "../icons/IconRenderer"

const Article = ({ item, iconType, backgroundColor, containerStyles, textStyles, includeHeaderIcon = false, useListIcons = true }) => {
    const { id, heading, listItems } = item
    return (
        <article key={id} className="flex flex-col gap-4">
            <header className="flex items-center gap-2">
                {includeHeaderIcon && iconType && <IconRenderer iconType={iconType} className="h-6 w-6 text-cyan-600" />}
                <h3 className="text-xl font-semibold">{heading}</h3>
                {item.subheading ? <p className="text-sm text-gray-400">
                    {item.subheading}
                </p> : <></>}
            </header>

            <List listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                iconType={useListIcons && iconType ? iconType : null}
                backgroundColor={backgroundColor}
                containerStyles={containerStyles}
                textStyles={textStyles} />
        </article>
    )
}

export default Article