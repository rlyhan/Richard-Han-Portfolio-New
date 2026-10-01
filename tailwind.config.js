// tailwind.config.js

// Kept as constants so the neon glow in boxShadow below can't drift out of step
// with the accent itself.
const NEON = "#00DDBE";
const NEON_RGB = "0, 221, 190";

// Same again for `well`, which the Contact page's panel fills with and the About
// page's mobile scrim in backgroundImage falls across its portrait with: both have
// to answer to the same tone, not a swatch that can drift from it.
const WELL = "#2A241E";
const WELL_RGB = "42, 36, 30";

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
      //
      // Cards carry no border: they read as cards because the fill is LIGHTER
      // than the page and a black shadow darkens the page at their edge. That
      // needs the page at carbon-900, not true black — on #07090B the shadow
      // has nothing left to darken and lands at 1.05:1.
      colors: {
        carbon: {
          950: "#080C0F", // ink on a neon fill; the shadow's base
          900: "#12181E", // page background
          850: "#26303A", // modal panel. No darker: the scrim behind
          // composites to #0a0e11, where carbon-900 would be
          // 1.08:1 — gone. This holds 1.45:1.
          800: "#2E3B47", // card surface — 1.58:1 above the page
          700: "#364450", // card hover. A small step on purpose: any lighter
          // and `mute` drops under AA on it
          600: "#4A5966", // filled controls and pills
          400: "#8593A0", // de-emphasised ink, e.g. the footer (5.71:1)
        },
        // 16.4:1 on the page, 10.4:1 on a card. Body copy and headings.
        paper: "#F2F5F7",
        // Secondary copy. Sized to clear AA on the card's HOVER surface
        // (4.78:1), which is the tightest place it has to survive.
        mute: "#AAB6C0",
        // 10.3:1 on the page, and 11.3:1 the other way when carbon-950 sits
        // on a neon fill, so the accent works as ink or as surface.
        neon: {
          DEFAULT: NEON,
          400: "#5FEDD8", // hover — brighter, never duller
          500: NEON,
        },
        // A second accent, scoped to awards and nothing else: an award is a
        // different kind of fact from what neon marks (state, interactivity).
        // The moment gold appears elsewhere it stops reading as achievement.
        // 8.0:1 on a card, 13.8:1 with carbon-950 ink on the fill.
        gold: {
          DEFAULT: "#FFD447",
          400: "#FFE27A", // hover on the filled, linked variant
        },
        // The homepage's editorial palette. Scoped to the hero, which is a
        // light, paper-toned spread the dark page then slides over —
        // everything below it stays on carbon/neon.
        cream: "#F5F3EE", // the hero's ground, and the caption plate each
        // project card's title sits on
        shell: "#E8E4DD", // the bar at the foot of the hero: a half-step off
        // the ground, so the nav reads as its own field
        // without a second line drawn under the spread
        ink: "#2D2D2D", // hero copy — 12.4:1 on cream, 10.9:1 on shell
        // Muted hero copy: the intro's byline and closing note, each card's
        // number and category, the spread's counter.
        //
        // A step darker than the design's #787878, which lands at 4.0:1 on
        // cream and 3.9:1 on shell — every place this is used is label-sized,
        // so it has to clear AA as normal text. This holds 5.2:1 on cream and
        // 4.5:1 on shell.
        ash: "#666666",
        // The hero spread's hairlines: the rule under the work panel's
        // heading, the seam between the two halves, the grid the cards sit in
        // and the frame around each caption plate. Light enough to read as a
        // drawn edge on cream rather than as an outline around each cell — the
        // cells share seams, so a heavier line would draw three boxes instead
        // of one grid.
        grid: "#C9C2B6",
        // The well each project shot is matted on. The one dark ground in the
        // hero, and the reason the shots read as objects on a page rather than
        // as panels of their own: warm, so it sits with the paper tones above
        // instead of punching a hole in them.
        well: WELL,
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
      boxShadow: {
        // Two layers: a tight core darkening the page at the card's edge (this
        // replaces the border line), and a wide falloff that reads as height.
        card: "0 1px 2px rgba(0, 0, 0, 0.6), 0 10px 24px -6px rgba(0, 0, 0, 0.7)",
        // Hover adds a neon bloom. On a dark page a bigger black shadow is
        // nearly invisible, so the accent is what signals the hover.
        "card-hover": `0 2px 4px rgba(0, 0, 0, 0.6), 0 18px 40px -8px rgba(0, 0, 0, 0.85), 0 0 28px -4px rgba(${NEON_RGB}, 0.35)`,
        modal: "0 24px 70px -12px rgba(0, 0, 0, 0.9)",
      },
      // Three faces, and each one has a job — see the @font-face block in
      // index.css for which weights of them are actually loaded.
      //
      // `heading` is the page's own; `urbanist` and `epilogue` are the hero's
      // pair, and stay scoped to it the way its palette does. The name at the
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
  plugins: [],
};
