import AwardIcon from "../icons/AwardIcon"
import IconRenderer from "../icons/IconRenderer"

// Outlined, not filled: a carbon-600 fill is close enough to the card beneath it
// to read as dull grey rather than as a deliberate surface. The outline gives the
// pill a shape without introducing another tinted surface, and white stays a rank
// below the neon pills beside it. Every surface a pill lands on is a card or the
// modal panel, so "default" and "card" collapse to one treatment — they stay
// separate keys because call sites distinguish them and the surfaces could
// diverge again.
const OUTLINE = "border border-paper text-paper bg-transparent"

const themeMapping = {
    "default": OUTLINE,
    "card": OUTLINE,
    // Gold, not neon: neon marks state and interactivity everywhere else on the
    // page, so an award in neon would read as "this is clickable". Gold says
    // achievement and says it nowhere else. Still an outline, so it's the same
    // kind of object as the type pill beside it, one rank up.
    "award": "border border-gold text-gold bg-transparent font-bold",
    // Filled where the pill has to win against a row of outlines — gold clears
    // 13.8:1 with carbon-950 ink, so a fill costs no legibility. The border
    // matches the fill purely so every pill in a row is the same height; without
    // it these sit 2px shorter than the outlined ones next to them.
    "award-muted": "border border-gold bg-gold text-carbon-950 font-bold hover:bg-gold-400 hover:border-gold-400",
    "solid": "border border-neon bg-neon text-carbon-950 font-semibold hover:bg-neon-400 hover:border-neon-400"
}

const awardIconMapping = {
    "award": "text-gold/85",
    // sits on the neon fill above, so it takes the dark ink
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
