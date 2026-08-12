import classNames from "classnames"
import ListIcon from "../../icons/ListIcon"
import GalleryIcon from "../../icons/GalleryIcon"

const IconButton = ({ type, onClick, isActive }) => {
    const iconClass = classNames(
        "h-5 w-5 transition-colors",
        {
            // sits on the neon fill below, so it takes the dark ink
            "text-carbon-950": isActive,
            "text-paper group-hover:text-neon": !isActive,
        }
    );

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={type === "gallery" ? "Gallery view" : "List view"}
            aria-pressed={isActive}
            className={classNames(
                "group p-4 transition-colors",
                {
                    "bg-neon": isActive,
                    "bg-carbon-600 hover:bg-carbon-700": !isActive,
                }
            )}
        >
            {type === "gallery" ? (
                <GalleryIcon className={iconClass} />
            ) : (
                <ListIcon className={iconClass} />
            )}
        </button>
    );
};


export default IconButton