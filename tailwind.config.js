// tailwind.config.js

// Kept as a constant so `well`'s light value and the About page's mobile scrim in
// backgroundImage, which falls across its portrait in the same tone, can't drift
// out of step.
const WELL = "#2A241E";
const WELL_RGB = "42, 36, 30";

// The paper tones, each with its value in both schemes. The dark scheme inverts
// these, all but cream, and leaves the frame and the scrim alone: they mat the shots, which look
// the same in either scheme. The tokens read through a variable of the
// same name, which the plugin at the foot of this file sets for each scheme: the
// OS's, unless the masthead's toggle has put a `data-theme` on <html>.
const PAPER = {
  // The plates laid on the ground: a write-up's tags, About's icons and
  // interest chips. A step lighter than fog and mist in both schemes, not
  // inverted — a near-black plate on dark grey read as a hole, not a plate.
  cream: { light: "#F7F7F5", dark: "#252524" },
  // The hero's ground, and in light every other opening's (see stage):
  // neutral grey where the reading below is mist, so the opening reads as its
  // own surface.
  fog: { light: "#D9D9D6", dark: "#222222" },
  // The hero's dots, in dark only: there fog sits so close to mist that the
  // dots are what gives it a surface, where in light the grey does it alone. A
  // warm grey, so they read as cream.
  dot: { light: "transparent", dark: "#6B665D" },
  // What follows a dotted opening — the Projects list, a write-up's article —
  // Contact's text, and the footer under each: fog a step lighter, so the dots
  // end without the jump to cream.
  mist: { light: "#E8E8E5", dark: "#1A1A1A" },
  // The pinned nav bar: a half-step off the ground, so it reads as its own
  // field — darker than mist in light, lighter in dark.
  shell: { light: "#DEDEDB", dark: "#201F1C" },
  // Hero copy — 12.8:1 on cream and 10.2:1 on shell in light, 12.6:1 and 13.5:1
  // in dark.
  ink: { light: "#2D2D2D", dark: "#ECE8E1" },
  // Muted hero copy: the intro's byline and closing note, each card's number and
  // category, the spread's counter.
  //
  // Darker than the design's #787878 — every place this is used is label-sized,
  // so it has to clear AA as normal text, and the darkest ground it sits on is
  // fog. This holds 4.9:1 on fog, 5.2:1 on shell and 6.5:1 on cream
  // in light, 5.4:1, 5.6:1 and 5.2:1 in dark.
  ash: { light: "#595959", dark: "#9C968C" },
  // The hero spread's hairlines: the seam between the two halves, the grid the
  // cards sit in and the frame around each caption plate. Light enough to read
  // as a drawn edge on cream rather than as an outline around each cell — the
  // cells share seams, so a heavier line would draw three boxes instead of one
  // grid. 1.6:1 on cream in light, 1.5:1 in dark.
  grid: { light: "#C4C4C0", dark: "#45403A" },
  // The Contact page's title panel and its email button: the same near-black
  // in both schemes, with chalk type on it — 17.2:1.
  panel: { light: "#141414", dark: "#141414" },
  // The title panel's dots: beige rather than fog's grey, the one place they
  // carry colour, and in both schemes where fog's are dark only — the panel
  // doesn't change with the scheme, so neither do they.
  "panel-dot": { light: "#766B52", dark: "#766B52" },
  // The Projects masthead and a write-up's opening: fog in light, and in dark
  // Contact's panel and its beige dots, so every page below the hero opens on
  // the ground Contact does.
  stage: { light: "#D9D9D6", dark: "#141414" },
  "stage-dot": { light: "transparent", dark: "#766B52" },
  // The pinned bar over those pages and About: shell in light, and in dark the
  // mist Contact's own bar sits on, so every page below the hero is footed by
  // Contact's bar.
  bar: { light: "#DEDEDB", dark: "#1A1A1A" },
  // About's ground: mist in light, and in dark Contact's near-black, a step
  // under the bar, where mist would leave the bar level with the page.
  deep: { light: "#E8E8E5", dark: "#141414" },
  // The hero's work heading: dark in both schemes, so the bar heading the
  // shots is the darkest plate on the hero — in light no darker than the
  // name's ink, so the bar never outweighs the name. Chalk holds 12.8:1 on it.
  slate: { light: "#2D2D2D", dark: "#151515" },
  // Each project card's caption plate: cream in light, and in dark the work
  // heading's near-black, so the shots are headed and captioned alike there.
  // The plate's ink and ash hold 15.0:1 and 6.2:1 on it.
  plate: { light: "#F7F7F5", dark: "#151515" },
  // The well each project shot is matted on. The one dark ground in the
  // hero, and the reason the shots read as objects on a page rather than
  // as panels of their own: warm, the one warm ground among neutral greys, so
  // it sits with the photographs rather than punching a hole in the page.
  // Deeper in dark, below fog, so the mat still reads as a frame there rather
  // than merging with the ground.
  well: { light: WELL, dark: "#0E0C0A" },
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

      // How far a hero card's caption plate stands in from the card's edges,
      // and the padding under the plate's last line. The hero's links share a
      // baseline with that line, so their padding is worked out from both —
      // see HomeNav.
      spacing: {
        plate: "0.875rem",
        "plate-foot": "0.75rem",
      },

      // Single source of truth for the palette — index.css pulls the same
      // values back out with @apply rather than restating any hex.
      colors: {
        ...Object.fromEntries(
          Object.keys(PAPER).map((name) => [name, `var(--${name})`]),
        ),
        // Cream that never inverts: type and dots set on a shot, the scrim,
        // the panel or slate, which stay dark in both schemes.
        chalk: PAPER.cream.light,
      },
      backgroundImage: {
        // The dot grid on fog, tiled by the size set beside it.
        dots: "radial-gradient(circle, var(--dot) 1px, transparent 1.5px)",
        "panel-dots":
          "radial-gradient(circle, var(--panel-dot) 1px, transparent 1.5px)",
        "stage-dots":
          "radial-gradient(circle, var(--stage-dot) 1px, transparent 1.5px)",
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
        frame: "radial-gradient(ellipse at 50% 45%, #2D2B27 0%, #110F0C 100%)",
        // Below md, the About page's portrait carries that page's title, and a
        // photograph is not a ground to set type on. This is what gives the words something to
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
      // pair. The name is the one thing that crosses over: in the hero's h1
      // and in the nav bar's wordmark, it keeps the page's heading face rather
      // than the hero's display face.
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
        ':root[data-theme="dark"]': {
          ...paperVars("dark"),
          colorScheme: "dark",
        },
        ':root[data-theme="light"]': { colorScheme: "light" },
      }),
  ],
};
