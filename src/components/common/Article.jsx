import classNames from "classnames"
import List from "./List"
import IconRenderer from "../icons/IconRenderer"

// The card tint only separates from the page at 1.68:1, so the solid border is
// load-bearing here rather than decorative — don't soften it to an alpha value
const DEFAULT_CONTAINER_STYLES = "p-6 rounded-xl shadow-lg shadow-gray-950/25 bg-gray-100 transition-colors"
// text-base, not text-md — the latter isn't a Tailwind size and generated no CSS.
// gray-950 is the lightest ink that clears AA on this surface (4.60:1)
const DEFAULT_TEXT_STYLES = "text-base md:text-lg text-gray-950 font-medium leading-relaxed"

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
                    {/* header sits on the page background, not the card, so it takes dark text */}
                    {includeHeaderIcon && icon && <IconRenderer icon={icon} className="h-6 w-6 text-gray-800" />}
                    <h3 className="text-2xl md:text-3xl font-semibold font-heading uppercase text-gray-900">{heading}</h3>
                </div>
                {subheading && <p className="text-sm text-gray-800">{subheading}</p>}
            </header>

            <List
                listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                icon={useListIcons && icon ? icon : null}
                iconStyles="text-gray-950"
                containerStyles={containerStyles}
                textStyles={textStyles}
                splitFromMobile={splitListFromMobile}
            />
        </article>
    )
}

export default Article
