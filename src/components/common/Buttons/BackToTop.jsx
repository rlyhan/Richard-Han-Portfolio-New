import ArrowDownIcon from "../../icons/ArrowDownIcon";

// The ring in the middle of the nav bar, in the slot the hero's own copy of the bar
// leaves empty.
//
// The arrow is the site's one arrow, turned over: the page runs down and this points
// back up out of it.
//
// Hidden below md, where the bar is a single row with no middle to sit in — and a
// phone's own scroll back up is a flick rather than a journey.
const BackToTop = ({ onClick, label = "Back to top" }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="hidden size-9 place-items-center self-end rounded-full border border-grid p-0 text-ink transition-colors hover:bg-shell focus-visible:outline-ink md:mb-1 md:grid"
    >
        <ArrowDownIcon className="size-4 rotate-180" />
    </button>
);

export default BackToTop;
