// The About page's own copy. The work history and the technology lists are not
// here: those are WORK and TECH in work.data.js, which the page reads straight
// off, so the page and the rest of the site can't drift apart on the facts.

export const ABOUT_HEADING = "About.";

export const ABOUT_NOTE =
  "5+ years across frontend and full-stack development, specialising in React/Next.js applications and CMS-driven platforms, as well as Django and WordPress based applications. Currently exploring mobile native development and AI-assisted workflows to improve testing, quality and delivery. Currently freelancing.";

// The numbered labels down the left of the page. The number is the page's own
// running order rather than anything in the data, so it is stated once here
// with the section it belongs to.
export const ABOUT_SECTIONS = {
  experience: { id: "experience", label: "Work experience" },
  technologies: { id: "technologies", label: "Technologies" },
  interests: { id: "interests", label: "Interests" },
};

// The two interests that get a paragraph. Everything else is a tag below —
// the split is the point: a list of eight things each with a sentence reads as
// filler, so only the two worth reading about keep their prose.
export const INTERESTS = [
  {
    id: "music-interest",
    icon: "music",
    title: "Music",
    text: "Music is my #1 passion outside of dev. I love singing, guitar, and songwriting along with going to live shows. Favourite genres are indie rock, punk, metal, and folk.",
  },
  {
    id: "cinema-interest",
    icon: "cinema",
    title: "Cinema",
    text: "Favourites of 2025: Marty Supreme, Demon Slayer: Infinity Castle, The Long Walk, 28 Years Later, Sinners.",
  },
];

export const INTEREST_TAGS_NOTE = "Other things I like to do with my time:";

export const INTEREST_TAGS = [
  { id: "skiing", icon: "mountain", label: "Skiing" },
  { id: "cooking", icon: "chefHat", label: "Cooking" },
  { id: "gaming", icon: "gamepad", label: "Gaming" },
  { id: "japanese", icon: "languages", label: "Japanese" },
];
