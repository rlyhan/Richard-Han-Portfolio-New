import classNames from "classnames"
import ListIcon from "../../icons/ListIcon"
import GalleryIcon from "../../icons/GalleryIcon"

const IconButton = ({ type, onClick, isActive }) => {
    const iconClass = classNames(
        "h-5 w-5 transition-colors",
        {
            "text-black": isActive,
            "text-white group-hover:text-yellow-300": !isActive,
        }
    );

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isActive}
            className={classNames(
                "group p-4 transition-colors",
                {
                    "bg-yellow-300": isActive,
                    "bg-[#1a1a1a]": !isActive,
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