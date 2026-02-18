import { useEffect, useRef } from "react";

export default function VantaBackground() {
    const containerRef = useRef(null);
    const vantaRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            if (!containerRef.current || vantaRef.current) return;

            const p5 = await import("p5");
            globalThis.p5 = p5.default;

            const { default: TRUNK } = await import("vanta/dist/vanta.trunk.min");

            if (cancelled || !containerRef.current) return;

            vantaRef.current = TRUNK({
                el: containerRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 0.70,
                scaleMobile: 1.00,
                backgroundColor: 0x171717,
                color: 0x9b9b8c,
                spacing: 0.00,
                chaos: 4.00,
            });
        }

        init();

        return () => {
            cancelled = true;
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-65" aria-hidden="true" />;
}