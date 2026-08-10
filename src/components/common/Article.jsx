import classNames from "classnames"
import List from "./List"
import IconRenderer from "../icons/IconRenderer"

// Borderless. carbon-800 sits 1.58:1 above the page and shadow-card darkens the
// page at the edge — together that's a 1.79:1 boundary. Both halves are needed:
// the fill alone is soft, and the shadow alone is nearly invisible this dark.
const DEFAULT_CONTAINER_STYLES = "p-6 rounded-xl bg-carbon-800 shadow-card transition-colors"
// text-base, not text-md — the latter isn't a Tailwind size and generated no CSS.
const DEFAULT_TEXT_STYLES = "text-base md:text-lg text-paper font-medium leading-relaxed"

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
                    {/* header sits on the page background, not the card — the icon
                        is the accent's cue that a group starts here */}
                    {includeHeaderIcon && icon && <IconRenderer icon={icon} className="h-6 w-6 text-neon" />}
                    <h3 className="text-2xl md:text-3xl font-semibold font-heading uppercase text-paper">{heading}</h3>
                </div>
                {subheading && <p className="text-sm text-mute">{subheading}</p>}
            </header>

            <List
                listItems={listItems}
                keyPrefix={`${id}-articleitem`}
                icon={useListIcons && icon ? icon : null}
                iconStyles="text-neon"
                containerStyles={containerStyles}
                textStyles={textStyles}
                splitFromMobile={splitListFromMobile}
            />
        </article>
    )
}

export default Article
