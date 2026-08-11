// Where a section comes to rest when it is navigated to, wherever that
// navigation came from — a nav item, or the hero's scroll cue. Both land in the
// same place because both ask this.

// A section's resting position in the document, summed from the layout rather
// than read off its live box. About carries a scroll-driven transform while it
// climbs over the hero, and a box-based measurement would include that offset,
// aiming a scroll target low by however far the section had yet to travel.
const getSectionFlowTop = (element) => {
    let top = 0
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop
    return top
}

// The header bar is fixed and paints over the page, so it is deducted from every
// landing: a section scrolled flush to the top of the viewport would lose its
// first 70-odd pixels — its own top padding — behind the bar, leaving its
// heading hard against the bar's edge.
export const getHeaderBarHeight = () =>
    document.querySelector("header nav")?.offsetHeight ?? 0

// Clamped at zero for sections close enough to the top that clearing the bar
// would mean scrolling past the start of the page.
export const getSectionRestingScrollY = (element, headerHeight = getHeaderBarHeight()) =>
    Math.max(getSectionFlowTop(element) - headerHeight, 0)
