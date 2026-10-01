// A `window.matchMedia` stand-in that answers one query truthfully and everything
// else as not matching, for the tests that need to flip `prefers-reduced-motion`
// deliberately rather than take the setup default.
export function mockMatchMedia(matchingQuery) {
    return (query) => ({
        matches: query === matchingQuery,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })
}

export const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
