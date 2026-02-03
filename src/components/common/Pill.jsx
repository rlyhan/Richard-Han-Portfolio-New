import AwardIcon from "../icons/AwardIcon"

const themeMapping = {
    "default": "border border-white/20 text-gray-300 bg-transparent",
    "award": "border border-yellow-300/85 text-yellow-300/85 bg-transparent font-bold"
}

const Pill = ({ label, theme = "default" }) => {
    return (
        <div className={`flex items-center rounded-xl px-3 py-1 text-xs ${themeMapping[theme]}`}>
            {theme === "award" && <AwardIcon className="h-3 w-3 mr-1 shrink-0 text-yellow-300/85" />}
            {label}
        </div>

    )
}

export default Pill
