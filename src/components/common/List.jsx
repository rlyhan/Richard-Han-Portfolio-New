import IconRenderer from "../icons/IconRenderer";

const List = ({ listItems = [], keyPrefix, icon = null, backgroundColor = null, containerStyles = null, textStyles = null }) => {
    const Icon = icon ? <IconRenderer icon={icon} className="h-4 w-4 mt-1 shrink-0 text-cyan-600" /> : null

    const backgroundColorClass = backgroundColor ? backgroundColor : "bg-white/5"
    const containerClasses = containerStyles ? containerStyles : "p-4 rounded-md"
    const textClasses = textStyles ? textStyles : "text-white/80 text-sm"

    return (
        <ul className={`space-y-2 h-full ${backgroundColorClass} ${containerClasses}`}>
            {listItems.map((listItem, i) => (
                <li
                    key={`${keyPrefix}-${i}`}
                    className="flex items-start gap-3"
                >
                    {Icon && Icon}
                    <span className={textClasses}>{listItem}</span>
                </li>
            ))}
        </ul>
    );
};


export default List