import classNames from "classnames"
import List from "./List"
import IconRenderer from "../icons/IconRenderer"

const DEFAULT_CONTAINER_STYLES = "p-6 rounded-xl border border-teal-200 bg-gray-400 transition-colors"
const DEFAULT_TEXT_STYLES = "text-md md:text-xl text-neutral-50 font-medium leading-relaxed"

const Article = ({
    item,
    icon,
    containerStyles = DEFAULT_CONTAINER_STYLES,
    textStyles = DEFAULT_TEXT_STYLES,
    includeHeaderIcon = false,
    useListIcons = true,
    alignHeaders = false,
    splitListFromMobile = false,
}) => {
    const { id, heading, subheading, listItems } = item
    return (
        // alignHeaders: take two rows from the parent grid instead of laying out
        // internally, so every article in a row shares one header track and the
        // lists start at the same y regardless of how many lines a heading takes
        <article key={id} className={classNames("gap-4", alignHeaders ? "grid grid-rows-subgrid row-span-2" : "flex flex-col")}>
            <header className="flex flex-col gap-2">
                <div className="flex gap-2 items-start">
                    {includeHeaderIcon && icon && <IconRenderer icon={icon} className="h-6 w-6 text-teal-400" />}
                    <h3 className="text-xl md:text-3xl font-semibold font-heading uppercase">{heading}</h3>
                </div>
                {subheading && <p className="text-sm text-gray-100">{subheading}</p>}
            </header>

            <List
                listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                icon={useListIcons && icon ? icon : null}
                containerStyles={containerStyles}
                textStyles={textStyles}
                splitFromMobile={splitListFromMobile}
            />
        </article>
    )
}

export default Article
