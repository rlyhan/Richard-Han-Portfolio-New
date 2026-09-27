import ArrowDownIcon from "../../icons/ArrowDownIcon";

// The ring in the middle of the nav bar — the same place the hero's scroll cue
// holds on the homepage, which is why that slot in the bar is left empty.
//
// The arrow is the page's one arrow, turned over, rather than a second icon: the
// cue pointing down into the page and this pointing back up out of it are the same
// gesture in two directions.
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
