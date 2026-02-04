import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VantaDotsBG() {
    const containerRef = useRef(null);
    const vantaRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            if (!containerRef.current || vantaRef.current) return;

            // Set before Vanta import
            globalThis.THREE = THREE;

            const { default: DOTS } = await import("vanta/dist/vanta.dots.min");

            if (cancelled || !containerRef.current) return;

            vantaRef.current = DOTS({
                el: containerRef.current,
                THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                scale: 1,
                scaleMobile: 1,
                color: 0x777777,
                color2: 0xeab308,
                backgroundColor: 0x000000,
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

    return <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
