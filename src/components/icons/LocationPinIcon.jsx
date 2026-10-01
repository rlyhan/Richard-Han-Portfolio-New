const LocationPinIcon = ({ className = "" }) => {
    // Pings outward from the pin's own dot to read as a live location, not a
    // static marker. SVG's transform-origin defaults to the viewport, not the
    // shape, so it's pinned here to the dot's centre (matching its cx/cy).
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="10"
                r="3"
                className="origin-[12px_10px] animate-ping fill-current stroke-none opacity-60"
            ></circle>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"></path>
            <circle cx="12" cy="10" r="3" className="fill-current stroke-none"></circle>
        </svg>
    );
};

export default LocationPinIcon;
