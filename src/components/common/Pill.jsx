import AwardIcon from "../icons/AwardIcon"
import IconRenderer from "../icons/IconRenderer"

const OUTLINE = "border border-paper text-paper bg-transparent"

const themeMapping = {
    "default": OUTLINE,
    "card": OUTLINE,
    "award": "border border-gold text-gold bg-transparent font-bold",
    "award-muted": "border border-gold bg-gold text-carbon-950 font-bold hover:bg-gold-400 hover:border-gold-400",
    "solid": "border border-neon bg-neon text-carbon-950 font-semibold hover:bg-neon-400 hover:border-neon-400"
}

const awardIconMapping = {
    "award": "text-gold/85",
    "award-muted": "text-carbon-950"
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
            // Nested inside clickable cards — follow the link, don't trigger the card
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
        >
            {content}
        </a>
    )
}

export default Pill
