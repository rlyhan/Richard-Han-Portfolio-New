import PROJECTS from "./projects.data"

// The hero's copy and the slice of the project list it puts on the front page.
// Nothing here restates a project: the cards read name and category straight off
// projects.data, so the homepage can't drift from the Projects section below it.

// Four lines, because the hero's exit throws them off the screen as four planes —
// see useHeroToAboutHandoff.
export const INTRO_LINES = [
    "Auckland, NZ",
    "based.",
    "Front end.",
    "Full stack.",
]

export const INTRO_NOTE =
    "Building thoughtful digital experiences with a clear structure and a human touch."

// The byline above the display lines: who and where, stated once in small caps so
// the h1 underneath is free to be four lines of type rather than an introduction.
// The name repeats at the foot of the hero at display size — this is the caption
// version of it, and what makes the top of the page read as a masthead.
export const INTRO_TOPLINE = {
    name: "Richard Han",
    location: "Auckland, New Zealand",
}

export const FEATURED_LABEL = "Selected work"

// Three, and in this order: the masonry grid is hand-placed rather than flowed, so
// the layout below only describes these three cells. Adding a fourth here would
// leave it unplaced.
//
// Each cell names its own shot rather than reusing the one landscape screenshot the
// Projects section shows: the cards mat these whole on a dark well rather than
// cropping them to fill, so each one is shaped to the cell it hangs in.
//
// The intrinsic size travels with the asset and has to match the file — a ratio
// stated wrong here reserves the wrong box and shifts the spread when the image
// lands. So does the alt text: these are device mockups rather than screenshots,
// and what a card shows is a site ON something, which is the part a description
// of the project can't supply.
const FEATURED = [
    {
        id: "neat-places",
        image: {
            src: "neatplaces-tall.webp",
            width: 2048,
            height: 2732,
            alt: "The Neat Places travel site shown on a tablet",
        },
    },
    {
        id: "thakeham",
        image: {
            src: "thakeham.webp",
            width: 2400,
            height: 1800,
            alt: "The Thakeham housing site shown on a laptop",
        },
    },
    {
        id: "touchgrass",
        image: {
            src: "touchgrass.webp",
            width: 3200,
            height: 2276,
            alt: "Three phones showing screens from the Touchgrass app",
        },
    },
]

export const FEATURED_PROJECTS = FEATURED
    .map(({ id, image }) => {
        const project = PROJECTS.find((entry) => entry.id === id)
        return project && { ...project, image }
    })
    .filter(Boolean)
