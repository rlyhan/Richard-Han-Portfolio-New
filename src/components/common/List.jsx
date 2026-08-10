import IconRenderer from "../icons/IconRenderer";

const List = ({ listItems = [], keyPrefix, icon = null, backgroundColor = null, borderColor = null, containerStyles = null, textStyles = null, splitFromMobile = false }) => {
    const col1 = listItems.slice(0, 5);
    const col2 = listItems.slice(5);

    const Icon = icon ? <IconRenderer icon={icon} className="h-4 w-4 mt-1 shrink-0 text-teal-400" /> : null

    const backgroundColorClass = backgroundColor ? backgroundColor : "bg-gray-400"
    const borderColorClass = borderColor ? `border ${borderColor}` : ""
    const containerClasses = containerStyles ? containerStyles : "p-4 rounded-md"
    const textClasses = textStyles ? textStyles : "text-white/80 text-xs sm:text-sm"

    // With a second column of items, split side by side from md up — or from the
    // smallest screens when splitFromMobile is set
    const columnClasses = col2.length === 0
        ? "grid-cols-1"
        : (splitFromMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2")

    return (
        <div className={`sm:pr-[48px] grid ${columnClasses} gap-3 h-full ${backgroundColorClass} ${borderColorClass} ${containerClasses}`}>
            <ul className="flex flex-col gap-3">
                {col1.map((listItem, i) => (
                    <li
                        key={`${keyPrefix}-col1-${i}`}
                        className="flex items-start gap-2"
                    >
                        {Icon && Icon}
                        <span className={textClasses}>{listItem}</span>
                    </li>
                ))}
            </ul>
            {col2.length > 0 && (
                <ul className="flex flex-col gap-3">
                    {col2.map((listItem, i) => (
                        <li
                            key={`${keyPrefix}-col2-${i}`}
                            className="flex items-start gap-2"
                        >
                            {Icon && Icon}
                            <span className={textClasses}>{listItem}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default List