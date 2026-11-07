// Which project shots carry a ground of their own.
//
// Most of the mockups arrive on transparency and are matted on whatever the frame
// around them is standing on. A few are photographs — the device on a desk, in a
// room — and those already have a background, so they fill their frame and get
// cropped instead of being matted onto a second one. See MattedShot for the two
// fits.
//
// Keyed by filename because that is what the distinction is about. The same file
// is the hero's ticker tile, the Projects grid's tile and the write-up's shot, and it
// wants the same treatment in all three.
const BLEED_SHOTS = new Set([
  "neatplaces.webp",
  "thakeham.webp",
  "touchgrass.webp",
  "studywithnz.webp",
  "gnetwork.webp",
  "deadlyponies.webp",
  "gigsoflondon.webp",
  "physicsroom.webp",
  "coloursmith.webp",
  "jamesdunlop.webp",
  // "neverhaveiever.webp",
  "westcoasttas.webp",
  "ecc.webp",
]);

export const fitOf = (src) => (BLEED_SHOTS.has(src) ? "bleed" : "mat");

// Every shot is exported at this size, which is why it is stated once here rather
// than carried per project: it is a fact about the artwork, as the fit is.
//
// What it buys is the frame's first layout: a bleed shot is sized from its frame's
// height with its width left to follow, so without an intrinsic ratio the browser
// has nothing to compute that width from until the file arrives — it sits at the
// frame's own width, then widens to its real one. A shot that ever came out at
// another size would make this per-shot data, like the fit above.
export const SHOT_WIDTH = 1600;
export const SHOT_HEIGHT = 900;

// The smaller copies each shot is also exported at, named `<shot>-<width>.webp`,
// with the original standing in as the largest. index.html's preloads for the
// ticker spell out this same set, so the two change together.
const SHOT_WIDTHS = [400, 600, 800, 1200];

export const srcSetOf = (src) => {
  const name = src.replace(/\.webp$/, "");

  return [
    ...SHOT_WIDTHS.map(
      (width) => `/images/projects/${name}-${width}.webp ${width}w`,
    ),
    `/images/projects/${src} ${SHOT_WIDTH}w`,
  ].join(", ");
};
