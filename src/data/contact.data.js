// The Contact page's own copy.

// Set as two lines rather than left to wrap: the break is where the sentence turns,
// so it holds at every width instead of moving with the column.
export const CONTACT_HEADING_LINES = ["Let's chat about", "your next project."];

export const CONTACT_NOTE =
  "I'm available for freelance work, permanent roles, or simply a conversation about an idea you're carrying around.";

// The ways to reach me, in the order they're worth trying. No flag for whether a
// channel leaves the site: the page reads that off the href, so a link and the tab
// it opens in cannot disagree.
export const CONTACT_CHANNELS = [
  {
    id: "email",
    label: "Email",
    icon: "mail",
    href: "mailto:richard.ly.han@gmail.com",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/richard-ly-han/",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "github",
    href: "https://github.com/rlyhan",
  },
];

// The intrinsic size travels with the asset and has to match the file, as the
// homepage's featured shots do: a ratio stated wrong here reserves the wrong box.
export const CONTACT_PORTRAIT = {
  src: "/images/portrait.webp",
  width: 2688,
  height: 1680,
  alt: "Richard Han working at a laptop in a bright studio",
};
