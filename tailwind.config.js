// tailwind.config.js

// Kept as a constant so `well` — which the Contact page's panel fills with and the
// About page's mobile scrim in backgroundImage falls across its portrait with —
// can't drift out of step between the two: both have to answer to the same tone,
// not a swatch that can drift from it.
const WELL = "#2A241E";
const WELL_RGB = "42, 36, 30";

// The paper tones, each with its value in both schemes. The dark scheme inverts
// these and leaves the well, its frame and its scrim alone: they mat the shots,
// which look the same in either scheme. The tokens read through a variable of the
// same name, which the plugin at the foot of this file sets for each scheme: the
// OS's, unless the nav's toggle has put a `data-theme` on <html>.
const PAPER = {
  // The hero's ground, and the caption plate each project card's title sits on.
  cream: { light: "#F5F3EE", dark: "#16140F" },
  // The bar at the foot of the hero: a half-step off the ground, so the nav reads
  // as its own field without a second line drawn under the spread.
  shell: { light: "#E8E4DD", dark: "#201D18" },
  // Hero copy — 12.4:1 on cream and 10.9:1 on shell in light, 15.1:1 and 13.8:1
  // in dark.
  ink: { light: "#2D2D2D", dark: "#ECE8E1" },
  // Muted hero copy: the intro's byline and closing note, each card's number and
  // category, the spread's counter.
  //
  // A step darker than the design's #787878, which lands at 4.0:1 on cream and
  // 3.9:1 on shell — every place this is used is label-sized, so it has to clear
  // AA as normal text. This holds 5.2:1 on cream and 4.5:1 on shell in light,
  // 6.3:1 and 5.7:1 in dark.
  ash: { light: "#666666", dark: "#9C968C" },
  // The hero spread's hairlines: the rule under the work panel's heading, the
  // seam between the two halves, the grid the cards sit in and the frame around
  // each caption plate. Light enough to read as a drawn edge on cream rather than
  // as an outline around each cell — the cells share seams, so a heavier line
  // would draw three boxes instead of one grid. 1.5:1 on cream in both schemes.
  grid: { light: "#C9C2B6", dark: "#3A352D" },
};

const paperVars = (scheme) =>
  Object.fromEntries(
    Object.entries(PAPER).map(([name, tone]) => [`--${name}`, tone[scheme]]),
  );

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // The hero has a second breakpoint of its own: from here up there is
      // width enough to even out the two halves, where below it the spread
      // takes the larger share — see Home.
      screens: {
        wide: "90rem",
      },

      // Single source of truth for the palette — index.css pulls the same
      // values back out with @apply rather than restating any hex.
      colors: {
        ...Object.fromEntries(
          Object.keys(PAPER).map((name) => [name, `var(--${name})`]),
        ),
        // The well each project shot is matted on. The one dark ground in the
        // hero, and the reason the shots read as objects on a page rather than
        // as panels of their own: warm, so it sits with the paper tones above
        // instead of punching a hole in them.
        well: WELL,
        // Cream that never inverts: type and dots set on the well, the scrim or
        // a shot, which stay dark in both schemes.
        chalk: PAPER.cream.light,
      },
      backgroundImage: {
        // The ground the Projects page mats each shot on: `well`, vignetted.
        //
        // Flat `well` is right for the hero's cells, which are small enough that one
        // tone reads as a frame. At three-column size the same flat fill reads as a
        // slab, so this lifts the centre and takes the corners down — which is what
        // puts the shot in a frame rather than on a panel.
        //
        // The two stops sit either side of `well` in lightness, so the frame is the
        // hero's well with light falling on it rather than a second dark tone. Off
        // the 45% centre, because the shot is matted higher in the cell than it is
        // low — the caption plate takes the foot — so a centred highlight would sit
        // under the plate instead of behind the object.
        frame:
          "radial-gradient(ellipse at 50% 45%, #2D2B27 0%, #110F0C 100%)",
        // The Contact page's photograph carries that page's title, and a photograph
        // is not a ground to set type on. This is what gives the words something to
        // sit against.
        //
        // `well` rather than black, so it reads as the site's own dark tone falling
        // across the picture rather than as a grey card laid over it. It holds above
        // 0.8 through the first third, which is as high as the second line of the
        // title reaches — the stops are placed against that block, not spread evenly
        // — and is gone by 82%, so the subject's face is never under it.
        scrim: `linear-gradient(to top, rgba(${WELL_RGB}, 0.94) 0%, rgba(${WELL_RGB}, 0.88) 26%, rgba(${WELL_RGB}, 0.55) 44%, rgba(${WELL_RGB}, 0.16) 64%, rgba(${WELL_RGB}, 0) 82%)`,
      },
      // Three faces, and each one has a job — see the @font-face block in
      // index.css for which weights of them are actually loaded.
      //
      // `heading` is the page's own; `urbanist` and `epilogue` are the hero's
      // pair. The name at the
      // foot of the hero is the one thing that crosses over: it keeps the
      // page's heading face rather than the hero's display face.
      fontFamily: {
        heading: ['"Fjalla One"', "system-ui", "sans-serif"],
        urbanist: ["Urbanist", "system-ui", "sans-serif"],
        epilogue: ["Epilogue", "system-ui", "sans-serif"],
        sans: ["system-ui", "sans-serif"],
      },
      keyframes: {
        // The hero's project cards arriving on load. `both` holds the end
        // state, so the cards keep a transform once it finishes — nothing
        // inside them is positioned against the viewport, so that's free.
        //
        // It starts part-visible rather than at nothing, and that 0.25 is load
        // time rather than taste: a fully transparent element is not a largest-
        // contentful-paint candidate, so starting at 0 put this animation, plus
        // the stagger in front of it, inside the LCP measurement — the card's
        // shot was decoded and waiting while the fade ran. At 0.25 the card
        // counts from its first frame (`both` holds that state through the
        // stagger too), and the rise is what carries the entrance.
        "project-reveal": {
          from: { opacity: "0.25", transform: "translateY(1.25rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "project-reveal": "project-reveal 0.8s ease-out both",
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ":root": paperVars("light"),
        "@media (prefers-color-scheme: dark)": {
          ':root:not([data-theme="light"])': paperVars("dark"),
        },
        ':root[data-theme="dark"]': { ...paperVars("dark"), colorScheme: "dark" },
        ':root[data-theme="light"]': { colorScheme: "light" },
      }),
  ],
};
