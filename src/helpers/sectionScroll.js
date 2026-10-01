// Where a section comes to rest when navigated to, from a nav item or from the
// handoff's own takeover. Both land in the same place because both ask this.

// Summed from the layout, not read off the live box: About carries a
// scroll-driven transform while it climbs over the hero, and a box measurement
// would include that offset, aiming the target low by whatever it had left to
// travel. helpers/handoff resolves its trigger positions the same way, for the
// same reason — a ScrollTrigger measured off a displaced box anchors itself to
// the displacement.
export const getSectionFlowTop = (element) => {
    let top = 0
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop
    return top
}

export const getSectionRestingScrollY = (element) => getSectionFlowTop(element)
