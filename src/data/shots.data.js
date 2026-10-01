// Which project shots carry a ground of their own.
//
// Most of the mockups arrive on transparency and are matted on whatever the frame
// around them is standing on. A few are photographs — the device on a desk, in a
// room — and those already have a background, so they fill their frame and get
// cropped instead of being matted onto a second one. See MattedShot for the two
// fits.
//
// Keyed by filename because that is what the distinction is about. The same file
// is the hero's card, the Projects grid's tile and the write-up's shot, and it
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
  "neverhaveiever.webp",
  "westcoasttas.webp",
]);

export const fitOf = (src) => (BLEED_SHOTS.has(src) ? "bleed" : "mat");

// The widths every shot is emitted at, and the srcset that offers them.
//
// A shot comes out of the mockup 3000px wide and is never drawn at more than about
// 2000 — the write-up's own shot on a wide screen, which is the widest frame on the
// site. Below that the ladder is the three frames' own range: a phone tile at the
// foot, a desktop tile and the homepage's lead card in the middle. Vite emits only
// these, so the 3000px masters never ship.
//
// A literal rather than a joined list of widths: Vite reads glob arguments at build
// time and cannot evaluate an expression.
const SRCSETS = import.meta.glob("../assets/shots/*.webp", {
  query: "?w=480;768;1200;1600;2000&as=srcset",
  import: "default",
  eager: true,
});

// The `src` beside that srcset: what a browser reaching for one URL gets, and the
// middle of the ladder rather than the top, since the shot it stands in for is a
// tile more often than it is a write-up's.
const FALLBACKS = import.meta.glob("../assets/shots/*.webp", {
  query: "?w=1200&as=url",
  import: "default",
  eager: true,
});

// Both globs are keyed by path, and everything on this site names a shot by its
// filename — see BLEED_SHOTS, which is keyed the same way.
const byFilename = (modules) =>
  Object.fromEntries(
    Object.entries(modules).map(([path, value]) => [
      path.slice(path.lastIndexOf("/") + 1),
      value,
    ]),
  );

const SHOT_SRCSETS = byFilename(SRCSETS);
const SHOT_FALLBACKS = byFilename(FALLBACKS);

// What to put on the <img> for a shot, by filename. See MattedShot, the one place
// that renders one, and the `sizes` each of its callers states — a srcset without a
// sizes is the browser guessing the frame is the whole viewport.
export const shotOf = (src) => ({
  src: SHOT_FALLBACKS[src],
  srcSet: SHOT_SRCSETS[src],
});
