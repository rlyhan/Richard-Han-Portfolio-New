import { useCallback, useMemo, useSyncExternalStore } from "react"

// md, as Tailwind has it.
export const MD_UP = "(min-width: 768px)"

// True while `query` matches. For the places where a breakpoint decides which
// markup to render rather than how one piece of markup looks — CSS can only hide
// markup, which still mounts it and fetches its images.
//
// The match list is the external store, so the first render already reads the real
// state: no mount-time flip from a guessed default, which would remount whatever
// the caller renders on the other side of the breakpoint.
export function useMediaQuery(query) {
    const list = useMemo(() => window.matchMedia(query), [query])

    const subscribe = useCallback((onChange) => {
        list.addEventListener("change", onChange)
        return () => { list.removeEventListener("change", onChange) }
    }, [list])

    return useSyncExternalStore(subscribe, () => list.matches)
}
