import AwardIcon from "../icons/AwardIcon"
import IconRenderer from "../icons/IconRenderer"

const themeMapping = {
    "default": "border border-white/20 text-gray-50 bg-transparent",
    "award": "border border-yellow-300 text-yellow-300 bg-transparent font-bold",
    // Mid-grey card surface: yellow-300 text only reaches 3.1:1 there, so the
    // label goes white and yellow is kept for the border and icon
    "award-muted": "border border-yellow-300 text-white bg-transparent font-bold",
    // Filled variant for pills that are links
    "solid": "border border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-100"
}

const awardIconMapping = {
    "award": "text-yellow-400/85",
    "award-muted": "text-yellow-300"
}

const Pill = ({ label, theme = "default", href = null, isExternal = true }) => {
    const classes = `flex items-center rounded-xl px-3 py-1 text-xs transition-colors ${themeMapping[theme]}`

    const content = (
        <>
            {awardIconMapping[theme] && <AwardIcon className={`h-3 w-3 mr-1 shrink-0 ${awardIconMapping[theme]}`} />}
            {label}
            {href && isExternal && <IconRenderer icon="externalLink" className="h-3 w-3 ml-1 shrink-0" />}
        </>
    )

    if (!href) return <div className={classes}>{content}</div>

    return (
        <a
            href={href}
            className={classes}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            // Nested inside clickable cards — follow the link instead of
            // triggering the card
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
        >
            {content}
        </a>
    )
}

export default Pill
