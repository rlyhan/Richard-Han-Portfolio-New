// The About page's own copy. The work history and the technology lists are not
// here: those are WORK and TECH in work.data.js, which the page reads straight
// off, so the page and the rest of the site can't drift apart on the facts.

export const ABOUT_HEADING = "About.";

// The whole of the page's own prose, and the only copy the opening carries beside
// the title. Paragraphs rather than one string because the account turns three
// times — where I started, the years away, and now.
export const ABOUT_BIO = [
  "After studying full stack web development at Enspiral Dev Academy, I began my career working with Christchurch, New Zealand based studios Sons & Co and Voyage, gaining hands-on experience with both React/Next.js and Django/Python platforms across a range of client projects spanning eCommerce, architecture portfolios, government websites, and more.",
  "I then moved overseas for a few years to London, UK, where I worked with Make Agency, focused on Next.js, React, TypeScript and headless CMS-driven applications, as well as expanding to WordPress based applications.",
  "Currently I am freelancing back in NZ, recently working on a video-driven cinematographer's portfolio. I've also been broadening my skillset into areas including mobile development and AI-assisted development, using tools like Claude Code within a structured specification, testing and review process to move quickly without losing sight of maintainability, scalability or quality.",
];

// The numbered labels down the left of the page. The number is the page's own
// running order rather than anything in the data, so it is stated once here
// with the section it belongs to. The opening is not one of them: it carries the
// page's title itself rather than a numbered label.
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
