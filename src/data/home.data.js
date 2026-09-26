import PROJECTS from "./projects.data"

// The hero's copy and the slice of the project list it puts on the front page.
// Nothing here restates a project: the cards read name, category, description and
// image straight off projects.data, so the homepage can't drift from the Projects
// section below it.

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

export const FEATURED_LABEL = "Featured Projects"

// Three, and in this order: the masonry grid is hand-placed rather than flowed, so
// the layout below only describes these three cells. Adding a fourth here would
// leave it unplaced.
//
// Each cell names its own shot rather than reusing the one landscape screenshot the
// Projects section shows: these are shaped to the cells they sit in, and from 1440px
// the cards show them whole rather than cropping to fill.
//
// The intrinsic size travels with the asset and has to match the file — the lead card
// sizes itself from it, and a ratio stated wrong here reserves the wrong box and
// shifts the spread when the image lands.
const FEATURED = [
    { id: "neat-places", image: { src: "neatplaces-tall.webp", width: 2048, height: 2732 } },
    { id: "thakeham", image: { src: "thakeham.webp", width: 2400, height: 1800 } },
    { id: "touchgrass", image: { src: "touchgrass.webp", width: 3200, height: 2276 } },
]

export const FEATURED_PROJECTS = FEATURED
    .map(({ id, image }) => {
        const project = PROJECTS.find((entry) => entry.id === id)
        return project && { ...project, image }
    })
    .filter(Boolean)
