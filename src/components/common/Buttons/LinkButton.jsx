import classNames from "classnames";
import IconRenderer from "../../icons/IconRenderer";

const themeMapping = {
    // The primary action: an accent outline that fills in on hover, so the
    // strongest colour on the page is spent on the thing you're meant to click
    "default": "border border-neon text-neon font-bold hover:bg-neon hover:text-carbon-950",
    // A neutral secondary that stays quiet until hover. Currently unused — the
    // Contact row deliberately renders all three links as equal primaries — but
    // kept for the case where a button has to sit below another in rank.
    "solid-fill": "bg-carbon-600 text-paper font-semibold hover:bg-carbon-700 hover:text-neon",
}

const sizeMapping = {
    "small": "px-4 py-2 text-sm",
    "medium": "px-3 py-2 text-base",
    "large": "px-4 py-3 text-md md:text-lg",
}

const LinkButton = ({ href, label, isExternal = true, useExternalIcon = false, customIcon = null, theme = "default", size = "medium", additionalClasses = "" }) => {
    // currentColor, not a fixed ink: both themes recolour their label on hover and
    // the icon has to travel with it
    const iconElement = customIcon ? <IconRenderer icon={customIcon} className="h-6 w-6 shrink-0 mr-2" /> : null;

    return (
        <a
            href={href}
            className={
                classNames(`flex items-center justify-center border border-solid rounded-md ${sizeMapping[size]} transition-all duration-300 ease-in-out ${themeMapping[theme]}`, {
                    [additionalClasses]: additionalClasses.length > 0,
                })
            }
            target={{ ...isExternal ? "_blank" : {} }}
        >
            {iconElement}
            {label}
            {isExternal && useExternalIcon &&
                <IconRenderer icon="externalLink" className="ml-2 h-4 w-4 shrink-0" />
            }
        </a>
    );
};


export default LinkButton