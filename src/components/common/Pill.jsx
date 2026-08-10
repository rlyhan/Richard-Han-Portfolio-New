import AwardIcon from "../icons/AwardIcon"
import IconRenderer from "../icons/IconRenderer"

const themeMapping = {
    // Light-on-dark — for the project modal's #1a1a1a surface
    "default": "border border-white/20 text-gray-50 bg-transparent",
    "award": "border border-yellow-300 text-yellow-300 bg-transparent font-bold",
    // Dark-on-light — for the project card, which spans two surfaces (gray-300 at
    // rest, gray-500/85 on hover). gray-950 is the only ink that clears AA on both.
    "card": "border border-gray-900 text-gray-950 bg-transparent",
    // These two are filled rather than outlined because no single yellow or grey
    // holds 3:1 against both card states — a fill carries its own contrast
    // gray-900 edge, not yellow: the gold fill is only 1.11:1 against the resting
    // card, so the border is what gives the badge a shape on both states
    "award-muted": "border border-gray-900 bg-yellow-300 text-gray-950 font-bold",
    "solid": "border border-gray-900 bg-gray-900 text-gray-50 hover:bg-gray-800"
}

const awardIconMapping = {
    "award": "text-yellow-400/85",
    // sits on the yellow fill above, so it takes the dark ink
    "award-muted": "text-gray-950"
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
