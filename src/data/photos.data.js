// The photographs of me on the site. Their intrinsic sizes travel with them and have
// to match the files: a ratio stated wrong here reserves the wrong box.
//
// Two, because they do different jobs. The portrait is the About page's opening and
// is read as a picture of someone at work; the headshot is a face beside an
// invitation, and never appears larger than a few lines of type.

// The portrait's widths, for a srcset. index.html preloads it on /about with this
// same set and AboutOpening's sizes — the three change together, or the preload is
// a second download rather than the first.
export const PORTRAIT = {
  src: "/images/portrait-1200.webp",
  srcSet: [800, 1200, 1600, 2000]
    .map((width) => `/images/portrait-${width}.webp ${width}w`)
    .join(", "),
  width: 1200,
  height: 750,
  alt: "Richard Han working at a laptop in a bright studio",
};

export const HEADSHOT = {
  src: "/images/headshot.webp",
  width: 800,
  height: 800,
  alt: "Richard Han",
};
