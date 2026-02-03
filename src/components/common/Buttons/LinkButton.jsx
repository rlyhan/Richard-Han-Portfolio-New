import ExternalLinkIcon from "../../icons/ExternalLinkIcon";

const themeMapping = {
    "default": "bg-yellow-400 text-neutral-950 font-bold",
    "secondary": "bg-transparent border border-white/20 text-white/80"
}

const LinkButton = ({ href, label, isExternal = true, theme = "default" }) => {

    return (
        <a
            href={href}
            className={
                `flex items-center border border-solid rounded-md px-3 py-2 text-sm hover:opacity-60 transition-all duration-300 ease-in-out ${themeMapping[theme]}`
            }
            target={{ ...isExternal ? "_blank" : {} }}
        >
            {label}
            {isExternal &&
                <ExternalLinkIcon className="ml-2 h-4 w-4 shrink-0" />
            }
        </a>
    );
};


export default LinkButton