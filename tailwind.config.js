// tailwind.config.js

// The warm dark of the About page's mobile scrim in backgroundImage.
const SCRIM_RGB = "42, 36, 30";

// The paper tones, each with its value in both schemes. The dark scheme inverts
// these, all but cream, and leaves the frame and the scrim alone: they mat the shots, which look
// the same in either scheme. The tokens read through a variable of the
// same name, which the plugin at the foot of this file sets for each scheme: the
// OS's, unless the masthead's toggle has put a `data-theme` on <html>.
const PAPER = {
  // The plates laid on the ground: a write-up's tags, About's icons and
  // interest chips. In light, the grounds' own off-white, so a plate is its
  // hairline. In dark, a step lighter than mist, not inverted — a near-black
  // plate on dark grey read as a hole, not a plate.
  cream: { light: "#F7F7F5", dark: "#252524" },
  // The hero's ground. In light, the off-white every page shares — a grey dulled the
  // photographs and clashed with the warm blocks beside them. In dark, the same tone
  // as the other openings (see stage).
  fog: { light: "#F7F7F5", dark: "#141414" },
  // What follows an opening — the Projects list, a write-up's article —
  // Contact's text, and the footer under each. In light, the opening's off-white,
  // with a hairline between them. In dark, stage a step lighter, so the opening
  // ends without the jump to cream.
  mist: { light: "#F7F7F5", dark: "#1A1A1A" },
  // The pinned nav bar: a half-step off the ground, so it reads as its own
  // field — darker than mist in light, lighter in dark.
  shell: { light: "#DEDEDB", dark: "#201F1C" },
  // Hero copy — 12.8:1 on cream and 10.2:1 on shell in light, 12.6:1 and 13.5:1
  // in dark.
  ink: { light: "#2D2D2D", dark: "#ECE8E1" },
  // Muted hero copy: the intro's byline, each plate's number and category.
  //
  // Darker than the design's #787878 — every place this is used is label-sized,
  // so it has to clear AA as normal text, and the darkest ground it sits on is
  // shell. This holds 5.2:1 on shell and 6.5:1 on the off-white grounds in
  // light, and 6.3:1, 5.6:1 and 5.2:1 on stage, shell and cream in dark.
  ash: { light: "#595959", dark: "#9C968C" },
  // The intro's closing note: ash in dark, and a shade lighter in light — 6:1 on
  // fog. A paragraph in ash read heavier than the name above it.
  hush: { light: "#5F5F5F", dark: "#9C968C" },
  // The hairlines: the seam between the hero's two halves, and a write-up's rows.
  // Light enough to read as a drawn edge on cream. 1.6:1 on cream in light, 1.5:1
  // in dark.
  grid: { light: "#C4C4C0", dark: "#45403A" },
  // The Contact page's title panel and its email button: the same near-black
  // in both schemes, with chalk type on it — 17.2:1.
  panel: { light: "#141414", dark: "#141414" },
  // The Projects masthead and a write-up's opening: in light, the off-white every
  // page shares; in dark, Contact's panel, so every page below the hero opens on
  // the ground Contact does.
  stage: { light: "#F7F7F5", dark: "#141414" },
  // The pinned bar over those pages and About: in light the page's own off-white,
  // set off by its hairline, and in dark the mist Contact's own bar sits on, so
  // every page below the hero is footed by Contact's bar.
  bar: { light: "#F7F7F5", dark: "#1A1A1A" },
  // About's ground: the off-white every page shares in light, and in dark
  // Contact's near-black, a step under the bar, where mist would leave the bar
  // level with the page.
  deep: { light: "#F7F7F5", dark: "#141414" },
  // The type on the hero's light blocks: the same near-black as Contact's panel in
  // both schemes. Chalk holds 17.2:1 on it.
  slate: { light: "#141414", dark: "#141414" },
  // Each project's caption plate: cream in light, and in dark slate's near-black. Its
  // ink and ash hold 12.8:1 and 6.5:1 in light, at least 15:1 and 6:1 in dark.
  plate: { light: "#F7F7F5", dark: "#141414" },
  // The hairline around each plate, which holds it off a white shot in light and
  // off a near-black one in dark.
  "plate-edge": { light: "#DCDCD8", dark: "#2E2E2C" },
  // The hero's three page blocks, a yellow, its pale tint and a dark grey, the same
  // in both schemes. The yellow and its tint carry slate type, the grey chalk.
  "block-about": { light: "#F2C522", dark: "#F2C522" },
  "block-projects": { light: "#F3ECCB", dark: "#F3ECCB" },
  "block-contact": { light: "#4A4A47", dark: "#4A4A47" },
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
      // width enough to even out the two halves, where below it the blocks
      // take the larger share — see Home.
      screens: {
        wide: "90rem",
      },

      // Together, how far the labels on the hero's blocks and the line beside them
      // stand off the foot — see HomeNav.
      spacing: {
        plate: "0.875rem",
        "plate-foot": "0.75rem",
        "block-gutter": "clamp(1rem,1.6vw,1.75rem)",
      },

      // Single source of truth for the palette — index.css pulls the same
      // values back out with @apply rather than restating any hex.
      colors: {
        ...Object.fromEntries(
          Object.keys(PAPER).map((name) => [name, `var(--${name})`]),
        ),
        // Cream that never inverts: type set on a shot, the scrim,
        // the panel or slate, which stay dark in both schemes.
        chalk: PAPER.cream.light,
      },
      backgroundImage: {
        // The ground the Projects page mats each shot on: a warm dark, vignetted.
        //
        // At three-column size a flat fill reads as a slab, so this lifts the centre
        // and takes the corners down — which is what puts the shot in a frame rather
        // than on a panel.
        //
        // Off the 45% centre, because the shot is matted higher in the cell than it is
        // low — the caption plate takes the foot — so a centred highlight would sit
        // under the plate instead of behind the object.
        frame: "radial-gradient(ellipse at 50% 45%, #2D2B27 0%, #110F0C 100%)",
        // Below md, the About page's portrait carries that page's title, and a
        // photograph is not a ground to set type on. This is what gives the words something to
        // sit against.
        //
        // A warm dark rather than black, so it reads as the site's own dark tone falling
        // across the picture rather than as a grey card laid over it. It holds above
        // 0.8 through the first third, which is as high as the second line of the
        // title reaches — the stops are placed against that block, not spread evenly
        // — and is gone by 82%, so the subject's face is never under it.
        scrim: `linear-gradient(to top, rgba(${SCRIM_RGB}, 0.94) 0%, rgba(${SCRIM_RGB}, 0.88) 26%, rgba(${SCRIM_RGB}, 0.55) 44%, rgba(${SCRIM_RGB}, 0.16) 64%, rgba(${SCRIM_RGB}, 0) 82%)`,
      },
      // Three loaded faces, and each one has a job — see the @font-face block in
      // index.css for which weights of them are actually loaded.
      //
      // `heading` is the page's own; `urbanist` and `epilogue` are the hero's
      // pair. The name is the one thing that crosses over: in the hero's h1
      // and in the nav bar's wordmark, it keeps the page's heading face rather
      // than the hero's display face. `arial`, the titles on the project plates,
      // the hero's blocks and the byline, comes from the system.
      fontFamily: {
        arial: ["Arial", "Helvetica", "sans-serif"],
        heading: ['"Fjalla One"', "system-ui", "sans-serif"],
        urbanist: ["Urbanist", "system-ui", "sans-serif"],
        epilogue: ["Epilogue", "system-ui", "sans-serif"],
        sans: ["system-ui", "sans-serif"],
      },
      keyframes: {
        // The hero's blocks and ticker arriving on load. `both` holds the end
        // state, so they keep a transform once it finishes — nothing
        // inside them is positioned against the viewport, so that's free.
        //
        // It starts part-visible rather than at nothing, and that 0.25 is load
        // time rather than taste: a fully transparent element is not a largest-
        // contentful-paint candidate, so starting at 0 put this animation, plus
        // the stagger in front of it, inside the LCP measurement — a ticker
        // shot was decoded and waiting while the fade ran. At 0.25 the ticker
        // counts from its first frame (`both` holds that state through the
        // stagger too), and the rise is what carries the entrance.
        "project-reveal": {
          from: { opacity: "0.25", transform: "translateY(1.25rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "project-reveal": "project-reveal 0.8s ease-out both",
        ticker: "ticker 60s linear infinite",
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
