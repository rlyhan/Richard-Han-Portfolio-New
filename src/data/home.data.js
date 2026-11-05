// The hero's copy.

export const INTRO_NOTE =
  "Full Stack Developer, passionate about user experience, collaboration and creativity. Currently freelancing and open to opportunities.";

// Who and where. The name is the nav bar's wordmark; the location is the byline,
// the small-caps line above each page's heading.
export const INTRO_TOPLINE = {
  name: "Richard Han",
  location: "Auckland, New Zealand",
};

// A line per word, because the hero's exit throws each line off the screen as its
// own plane — see useHeroHandoff.
export const INTRO_LINES = `${INTRO_TOPLINE.name}.`.split(" ");
