import List from "./List"
import IconRenderer from "../icons/IconRenderer"

const DEFAULT_CONTAINER_STYLES = "p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
const DEFAULT_TEXT_STYLES = "text-base text-zinc-200 font-medium leading-relaxed"

const Article = ({
    item,
    icon,
    containerStyles = DEFAULT_CONTAINER_STYLES,
    textStyles = DEFAULT_TEXT_STYLES,
    includeHeaderIcon = false,
    useListIcons = true,
}) => {
    const { id, heading, subheading, listItems } = item
    return (
        <article key={id} className="flex flex-col gap-4">
            <header className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    {includeHeaderIcon && icon && <IconRenderer icon={icon} className="h-6 w-6 text-teal-500" />}
                    <h3 className="text-lg md:text-2xl font-semibold">{heading}</h3>
                </div>
                {subheading && <p className="text-sm text-gray-400">{subheading}</p>}
            </header>

            <List
                listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                icon={useListIcons && icon ? icon : null}
                containerStyles={containerStyles}
                textStyles={textStyles}
            />
        </article>
    )
}

export default Article
