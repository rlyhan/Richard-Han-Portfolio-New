import { useRef } from "react";
import { useVantaEffect } from "./useVantaEffect";

export default function VantaBackground() {
    const containerRef = useRef(null);
    useVantaEffect(containerRef);
    return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-50" style={{ contain: "strict" }} aria-hidden="true" />;
}
