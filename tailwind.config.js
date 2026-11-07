// tailwind.config.js

// The warm dark of the About page's mobile scrim in backgroundImage.
const SCRIM_RGB = "42, 36, 30";

// The paper tones, each with its value in both schemes. The dark scheme inverts
// these, all but cream, and leaves the frame and the scrim alone: they mat the shots, which look
// the same in either scheme. The tokens read through a variable of the
// same name, which the plugin at the foot of this file sets for each scheme: the
// OS's, unless the masthead's toggle has put a `data-theme` on <html>.
const PAPER = {
  // The plates laid on the ground: a write-up's tags. In light, the grounds' own off-white, so a plate is its
  // hairline. In dark, a step lighter than shell, not inverted — a near-black
  // plate on dark grey read as a hole, not a plate.
  cream: { light: "#F7F7F5", dark: "#2D2C29" },
  // The hero's ground, and About's below its opening. In light, the off-white every
  // page shares — a grey dulled the photographs and clashed with the warm blocks
  // beside them. In dark, a warm charcoal — a near-black read as a hole beside the
  // hero's deep blocks.
  fog: { light: "#F7F7F5", dark: "#1E1D1B" },
  // What follows an opening — a write-up's article — Contact's text, and the
  // footer under each. In light, the opening's off-white,
  // with a hairline between them. In dark, a step above the hero's charcoal, so
  // a page's deeper opening ends without the jump to cream.
  mist: { light: "#F7F7F5", dark: "#232220" },
  // The pinned nav bar: a half-step off the ground, so it reads as its own
  // field — darker than mist in light, lighter in dark.
  shell: { light: "#DEDEDB", dark: "#292825" },
  // Hero copy — 12.8:1 on cream and 10.2:1 on shell in light, 11.4:1 and 12.1:1
  // in dark.
  ink: { light: "#2D2D2D", dark: "#ECE8E1" },
  // Muted hero copy: the intro's byline.
  //
  // Darker than the design's #787878 — every place this is used is label-sized,
  // so it has to clear AA as normal text, and the darkest ground it sits on is
  // shell. This holds 5.2:1 on shell and 6.5:1 on the off-white grounds in
  // light, and 6.1:1, 5:1 and 4.8:1 on smoke, shell and cream in dark.
  ash: { light: "#595959", dark: "#9C968C" },
  // The intro's closing note: ash in dark, and a shade lighter in light — 6:1 on
  // fog. A paragraph in ash read heavier than the name above it.
  hush: { light: "#5F5F5F", dark: "#9C968C" },
  // The hairlines: the seam between the hero's two halves, and a write-up's rows.
  // Light enough to read as a drawn edge on cream. 1.6:1 on cream in light, 1.5:1
  // in dark.
  grid: { light: "#C4C4C0", dark: "#4B463F" },
  // The opening of every page below the hero — About's, a write-up's — the whole
  // of Projects, its list included, and the nav bar at the foot of those pages, pinned or Contact's
  // own: the off-white every page shares in light, and in dark a step under the
  // hero's charcoal, so a page's opening stands apart from what follows it and its
  // bar closes it in the tone it began.
  smoke: { light: "#F7F7F5", dark: "#171614" },
  // The same near-black in both schemes: Contact's title panel and its email
  // button, and the type on the hero's light blocks. Chalk holds 17.2:1 on it.
  slate: { light: "#141414", dark: "#141414" },
  // The hero's three page blocks: a blue-grey, a pale sand and a deeper taupe, all
  // carrying slate type in light. In dark, About and Contact go deep and carry chalk,
  // so the sand under the ticker is the one bright block beside the near-black ground.
  "block-about": { light: "#9DB5D0", dark: "#34476A" },
  "block-projects": { light: "#F6F0D3", dark: "#F6F0D3" },
  "block-contact": { light: "#BCB09C", dark: "#5A5044" },
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

      // `block-foot`: how far the labels on the hero's blocks and the line beside
      // them stand off the foot, so the two share a baseline — see HomeFooter.
      spacing: {
        "block-foot": "calc(1.625rem + 1px)",
        "block-gutter": "clamp(1rem,1.6vw,1.75rem)",
      },

      // Single source of truth for the palette — index.css pulls the same
      // values back out with @apply rather than restating any hex.
      colors: {
        ...Object.fromEntries(
          Object.keys(PAPER).map((name) => [name, `var(--${name})`]),
        ),
        // Cream that never inverts: type set on a shot, the scrim,
        // or slate, which stays dark in both schemes.
        chalk: PAPER.cream.light,
      },
      backgroundImage: {
        // The ground the Projects page mats each shot on: a warm dark, vignetted.
        //
        // At three-column size a flat fill reads as a slab, so this lifts the centre
        // and takes the corners down — which is what puts the shot in a frame rather
        // than on a panel.
        frame: "radial-gradient(ellipse at 50% 50%, #2D2B27 0%, #110F0C 100%)",
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
      // `heading` is the page's own; `urbanist` and `epilogue` are the display
      // pair. The name is the one thing that crosses over: in the hero's h1
      // and in the nav bar's wordmark, it keeps the page's heading face rather
      // than the display face. `arial`, the titles on the project plates, the
      // hero's blocks, its note and the byline, comes from the system.
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
