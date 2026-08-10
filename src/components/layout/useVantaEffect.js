import { useEffect, useRef } from "react";
import gsap from "gsap";

// Fade durations kept in one place so hide delay in Header stays in sync.
const FADE_OUT_DURATION = 0.3;
const FADE_IN_DURATION = 0.4;

export function useVantaEffect(containerRef) {
    const vantaRef = useRef(null);

    useEffect(() => {
        const hide = () => {
            if (!containerRef.current) return;
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: FADE_OUT_DURATION,
                ease: "power2.in",
                onComplete: () => vantaRef.current?.p5?.noLoop(),
            });
        };

        // Prevents the IntersectionObserver from triggering show() mid-scroll
        // when a nav click to Home initiates a programmatic scroll.
        // Cleared inside show() once the scroll has settled.
        let suppressObserver = false;

        const show = () => {
            suppressObserver = false;
            if (!containerRef.current) return;
            vantaRef.current?.p5?.loop();
            gsap.to(containerRef.current, {
                opacity: 0.5,
                duration: FADE_IN_DURATION,
                ease: "power2.out",
            });
        };

        const onSuppress = () => { suppressObserver = true; };

        window.addEventListener("vanta:hide", hide);
        window.addEventListener("vanta:show", show);
        window.addEventListener("vanta:suppress", onSuppress);

        let cancelled = false;

        async function init() {
            if (!containerRef.current || vantaRef.current) return;
            try {
                const p5 = await import("p5");
                globalThis.p5 = p5.default;
                const { default: TRUNK } = await import("vanta/dist/vanta.trunk.min");
                if (cancelled || !containerRef.current) return;
                vantaRef.current = TRUNK({
                    el: containerRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200,
                    minWidth: 200,
                    scale: 0.7,
                    scaleMobile: 1,
                    backgroundColor: 0x171717,
                    color: 0x9b9b8c,
                    spacing: 0,
                    chaos: 4,
                });
            } catch (err) {
                console.error("Vanta failed to initialise:", err);
            }
        }

        init();

        const homeEl = document.querySelector("#home");
        let initialized = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!initialized) {
                    initialized = true;
                    if (entry.isIntersecting) return;
                }
                if (entry.isIntersecting) {
                    if (!suppressObserver) show();
                } else {
                    hide();
                }
            });
        }, { threshold: 0.5 });

        if (homeEl) observer.observe(homeEl);

        return () => {
            cancelled = true;
            observer.disconnect();
            window.removeEventListener("vanta:hide", hide);
            window.removeEventListener("vanta:show", show);
            window.removeEventListener("vanta:suppress", onSuppress);
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, []);
}
