import classNames from "classnames";
import IconRenderer from "../../icons/IconRenderer";

const themeMapping = {
    "default": "border border-gray-100 text-gray-100 font-bold hover:opacity-60",
    "solid-fill": "border border-white/20 bg-gray-200 text-gray-800 font-semibold hover:bg-gray-100 hover:opacity-60",
}

const sizeMapping = {
    "small": "px-4 py-2 text-sm",
    "medium": "px-3 py-2 text-base",
    "large": "px-4 py-3 text-md md:text-lg",
}

const LinkButton = ({ href, label, isExternal = true, useExternalIcon = false, customIcon = null, theme = "default", size = "medium", additionalClasses = "" }) => {
    const iconElement = customIcon ? <IconRenderer icon={customIcon} className="h-6 w-6 shrink-0 mr-2 text-neutral-700" /> : null;

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