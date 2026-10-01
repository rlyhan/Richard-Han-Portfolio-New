import PROJECTS from "./projects.data";
import { fitOf } from "./shots.data";

// The hero's copy and the slice of the project list it puts on the front page.
// Nothing here restates a project: the cards read name and category straight off
// projects.data, so the homepage can't drift from the Projects section below it.

// Four lines, because the hero's exit throws them off the screen as four planes —
// see useHeroHandoff.
export const INTRO_LINES = ["Engaging", "digital", "experiences."];

export const INTRO_NOTE =
  "Front End and Full Stack Developer, passionate about user experience, collaboration and creativity. Currently freelancing and open to opportunities.";

// The byline above the display lines: who and where, stated once in small caps so
// the h1 underneath is free to be four lines of type rather than an introduction.
// The name repeats at the foot of the hero at display size — this is the caption
// version of it, and what makes the top of the page read as a masthead.
export const INTRO_TOPLINE = {
  name: "Richard Han",
  location: "Auckland, New Zealand",
};

export const FEATURED_LABEL = "Featured work";

// Three, and in this order: the masonry grid is hand-placed rather than flowed, so
// the layout below only describes these three cells. Adding a fourth here would
// leave it unplaced.
//
// Each cell names its own shot, and its own intrinsic size with it. Some of these are
// the file the Projects section shows and some aren't: a card and a tile crop the same
// picture to very different shapes, so which file suits is the cell's question rather
// than the project's. How a shot meets its frame isn't a question here at all — that
// travels with the file, in shots.data.
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
      src: "neatplaces.webp",
      width: 3000,
      height: 1688,
      alt: "The Neat Places travel site shown on a tablet",
    },
  },
  {
    id: "thakeham",
    image: {
      src: "thakeham.webp",
      width: 1600,
      height: 1047,
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
];

export const FEATURED_PROJECTS = FEATURED.map(({ id, image }) => {
  const project = PROJECTS.find((entry) => entry.id === id);
  return project && { ...project, image: { ...image, fit: fitOf(image.src) } };
}).filter(Boolean);
