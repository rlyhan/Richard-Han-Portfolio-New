// tailwind.config.js

// Kept as constants so the neon glow in boxShadow below can't drift out of step
// with the accent itself.
const NEON = "#00DDBE"
const NEON_RGB = "0, 221, 190"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Single source of truth for the palette — index.css pulls the same
            // values back out with @apply rather than restating any hex.
            //
            // Cards carry no border: they read as cards because the fill is
            // LIGHTER than the page (the dark-UI convention) and a black shadow
            // darkens the page right at their edge. That only works because the
            // page sits at carbon-900 rather than at true black — on #07090B a
            // black shadow has nothing left to darken and lands at 1.05:1.
            colors: {
                carbon: {
                    950: "#080C0F", // ink on a neon fill; the shadow's base
                    900: "#12181E", // page background
                    850: "#26303A", // modal panel. Can't go darker than this: the
                                    // scrim behind it composites to #0a0e11, and by
                                    // carbon-900 the panel is 1.08:1 against that —
                                    // gone. Here it still holds 1.45:1.
                    800: "#2E3B47", // card surface — 1.58:1 above the page
                    700: "#364450", // card hover. Deliberately a small step: any
                                    // lighter and `mute` drops under AA on it
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
                    600: "#00B89E", // pressed
                },
                // A second accent, scoped to awards and nothing else. An award is a
                // different KIND of fact from what neon marks (state, interactivity),
                // so it earns its own colour — but the moment gold appears anywhere
                // else it stops reading as "achievement" and the page is just
                // two-toned. 8.0:1 on a card, 13.8:1 with carbon-950 ink on the fill.
                gold: {
                    DEFAULT: "#FFD447",
                    400: "#FFE27A", // hover on the filled, linked variant
                },
            },
            boxShadow: {
                // Two layers on purpose: a tight core that darkens the page right
                // at the card's edge (this is what replaces the border line), and
                // a wide soft falloff that reads as height.
                card: "0 1px 2px rgba(0, 0, 0, 0.6), 0 10px 24px -6px rgba(0, 0, 0, 0.7)",
                // Hover adds a neon bloom. On a dark page a bigger black shadow is
                // nearly invisible, so the accent is what actually signals the
                // hover — it replaces the neon border the cards used to grow.
                "card-hover": `0 2px 4px rgba(0, 0, 0, 0.6), 0 18px 40px -8px rgba(0, 0, 0, 0.85), 0 0 28px -4px rgba(${NEON_RGB}, 0.35)`,
                bar: "0 8px 24px -14px rgba(0, 0, 0, 0.9)",
                modal: "0 24px 70px -12px rgba(0, 0, 0, 0.9)",
            },
            fontFamily: {
                heading: ['"Fjalla One"', 'system-ui', 'sans-serif'],
                sans: ['system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
