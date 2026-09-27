// The About page's interest icons — this one and the five below it — are drawn a
// hairline lighter than the rest of the set (1.5 against 2). They sit on the
// page's paper ground at label size rather than on a dark card, where the
// heavier stroke reads as a bold outline instead of a drawn mark.
const MusicIcon = ({ className = "" }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
    </svg>
);

export default MusicIcon;
