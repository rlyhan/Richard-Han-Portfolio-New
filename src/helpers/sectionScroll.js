// Where a section comes to rest when navigated to, from a nav item or the hero's
// scroll cue. Both land in the same place because both ask this.

// Summed from the layout rather than read off the live box: About carries a
// scroll-driven transform while it climbs over the hero, and a box measurement would
// include that offset, aiming the target low by however far it had yet to travel.
//
// Helpers/handoff resolves its trigger positions this way too, since a ScrollTrigger 
// measured off the live box while a section is displaced anchors itself to the 
// displacement.
export const getSectionFlowTop = (element) => {
    let top = 0
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop
    return top
}

// The bar is fixed and paints over the page, so it comes off every landing: flush to
// the viewport top, a section loses its first 70-odd pixels of top padding behind the
// bar, leaving its heading hard against the edge.
export const getHeaderBarHeight = () =>
    document.querySelector("header nav")?.offsetHeight ?? 0

// Clamped at zero for sections close enough to the top that clearing the bar
// would mean scrolling past the start of the page.
export const getSectionRestingScrollY = (element, headerHeight = getHeaderBarHeight()) =>
    Math.max(getSectionFlowTop(element) - headerHeight, 0)
