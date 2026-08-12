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
                    600: "#00B89E", // pressed
                },
                // A second accent, scoped to awards and nothing else: an award is a
                // different kind of fact from what neon marks (state, interactivity).
                // The moment gold appears elsewhere it stops reading as achievement.
                // 8.0:1 on a card, 13.8:1 with carbon-950 ink on the fill.
                gold: {
                    DEFAULT: "#FFD447",
                    400: "#FFE27A", // hover on the filled, linked variant
                },
            },
            boxShadow: {
                // Two layers: a tight core darkening the page at the card's edge (this
                // replaces the border line), and a wide falloff that reads as height.
                card: "0 1px 2px rgba(0, 0, 0, 0.6), 0 10px 24px -6px rgba(0, 0, 0, 0.7)",
                // Hover adds a neon bloom. On a dark page a bigger black shadow is
                // nearly invisible, so the accent is what signals the hover.
                "card-hover": `0 2px 4px rgba(0, 0, 0, 0.6), 0 18px 40px -8px rgba(0, 0, 0, 0.85), 0 0 28px -4px rgba(${NEON_RGB}, 0.35)`,
                bar: "0 8px 24px -14px rgba(0, 0, 0, 0.9)",
                modal: "0 24px 70px -12px rgba(0, 0, 0, 0.9)",
            },
            fontFamily: {
                heading: ['"Fjalla One"', 'system-ui', 'sans-serif'],
                sans: ['system-ui', 'sans-serif'],
            },
            // The fade tab panels enter on. For panels that swap via `display`, where
            // the flip restarts the animation itself; a transition would never fire,
            // since the incoming panel goes straight to its final opacity.
            //
            // The projects grid re-filters one panel in place, so nothing changes for
            // CSS to react to — it runs the same fade from src/hooks/useTabFade.js.
            // Keep the duration and easing in step with FADE_MS/FADE_EASING there.
            keyframes: {
                "tab-fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                "tab-fade-in": "tab-fade-in 0.35s ease-out both",
            },
        },
    },
    plugins: [],
}
