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

export const getSectionRestingScrollY = (element) => getSectionFlowTop(element)
