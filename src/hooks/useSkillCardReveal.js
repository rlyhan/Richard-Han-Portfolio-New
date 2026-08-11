import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// The rows inside `containerRef`, marked in the markup rather than found by
// walking the grid: the row is a layout div with nothing about it that reads as
// "row" from a selector, and a structural query would break the moment anything
// is nested between the section and its cards.
const ROW_SELECTOR = "[data-skill-row]"
const CARD_SELECTOR = "[data-skill-card]"

// The row's top edge entering from the foot of the viewport — the first frame
// where the reader can see the row is the first frame where a card starts to
// arrive, so nothing pops in already half-revealed.
const REVEAL_START = "top bottom"
// Where the group finishes, stated against whatever it is triggered off — the
// row from md up, the single card below it. Two constants rather than one
// because the two layouts are not the same shape: a third of a row is a small
// square well inside the viewport, while a full-width card on a phone is a
// large share of the screen.
//
// The row's top edge at the middle of the viewport, where the LAST card in the
// row lands. Everything below is arranged around that: the cards share this one
// stretch of scroll between them, so the further apart their starts are, the
// less of it each one gets to move through.
const ROW_REVEAL_END = "top center"
// The card's own top edge at 60% of the viewport height, which it passes on the
// way up BEFORE the middle — so the card is done a little sooner than the
// desktop rows are. That is the point: it is most of the screen by then, and
// holding the last of the fade until dead centre leaves the reader looking at a
// card that is still arriving after it has filled their view.
const CARD_REVEAL_END = "top 60%"

// How far below its resting place a card starts, in pixels. A transform, not a
// `bottom` offset: `bottom` on a static grid child does nothing without also
// making it relative, and once it is relative the browser is repainting a
// positioned box every frame instead of compositing a transform. The space is
// preserved either way — neither one is in the layout flow's way — but only the
// transform is free.
//
// Small on purpose. The card is fading in across the same distance, so the
// travel only has to suggest that it came from below; at any real distance the
// card spends the fade visibly sliding, which reads as a carousel rather than
// as something surfacing.
const CARD_LIFT = 56

// The share of the row's scroll range that ONE card takes to complete, with the
// rest of the range spent waiting for the cards behind it. At 0.5 the first
// card is done by the halfway point and the last is only starting — the row
// fills left to right with two cards moving at once, and never all three.
//
// Raising it tightens the row towards moving as a block; lowering it spreads
// the cards further apart and leaves each one snapping through its own fade.
const CARD_SHARE = 0.5

// Seconds of catch-up between the scroll position and the reveal, the same
// device (and the same reasoning) as the hero handoff's SCRUB_LAG: it is what
// keeps the cards from being welded to the scrollbar, so they trail the wheel
// and settle a beat after it stops.
//
// Deliberately shorter than the 1s the handoff and the text sweep use. Those
// are long moves where the lag reads as weight; this one is a 56px lift, and at
// a full second of catch-up the row is still arriving well after the scroll
// that called for it has stopped — which reads as lateness, not as weight.
const REVEAL_LAG = 0.4

// Cards arranged so the last one in the group finishes exactly at `end`.
//
// The total length of a stagger is duration + stagger * (count - 1), so pinning
// that total to 1 is what puts the last card's landing on the trigger's end
// rather than somewhere past it. Derived from the count rather than written
// down as a number so a row of two or four keeps the same landing.
//
// A single card needs none of that arithmetic and gets none: gap falls to 0,
// leaving a plain tween whose progress the scrub maps across the whole range.
const buildRevealTween = ({ cards, trigger, end }) => {
    const gap = cards.length > 1 ? (1 - CARD_SHARE) / (cards.length - 1) : 0

    return gsap.fromTo(cards,
        { opacity: 0, y: CARD_LIFT },
        {
            opacity: 1,
            y: 0,
            duration: CARD_SHARE,
            stagger: gap,
            // With a scrub the scroll is the ease, and a second one layered on
            // top only makes the mapping between the two lie.
            ease: "none",
            scrollTrigger: {
                trigger,
                start: REVEAL_START,
                end,
                scrub: REVEAL_LAG,
            },
        }
    )
}

// The skill cards inside `containerRef` fading up into place, scrubbed off the
// scroll that brings their row onto the screen.
export function useSkillCardReveal(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is built and nothing is set, so the cards
        // render exactly as they always have: in place, at full opacity.
        //
        // The breakpoint is Tailwind's `md`, because that is where the grid
        // turns three across. Below it the cards are a single column, and a
        // staggered row makes no sense there: the "row" is taller than the
        // viewport, so pacing the stagger off its top edge would have cards two
        // and three finishing their reveal while still below the fold, and the
        // reader would scroll down to find them already there.
        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
            container.querySelectorAll(ROW_SELECTOR).forEach((row) => {
                buildRevealTween({
                    cards: gsap.utils.toArray(row.querySelectorAll(CARD_SELECTOR)),
                    trigger: row,
                    end: ROW_REVEAL_END,
                })
            })
        })

        // One column: each card is its own row, and so gets its own trigger and
        // the whole of the range to itself. Same start as above and its own
        // landing, both measured against the card instead of against the row.
        mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
            container.querySelectorAll(CARD_SELECTOR).forEach((card) => {
                buildRevealTween({ cards: [card], trigger: card, end: CARD_REVEAL_END })
            })
        })

        // Reverts every tween and trigger built above, and the opacity and
        // transform they set along the way.
        return () => mm.revert()
    }, [containerRef])
}
