import IconRenderer from "../icons/IconRenderer";

// iconStyles is caller-controlled because this list renders on two opposite
// surfaces: the light card in About (needs dark icons) and the dark project modal
const List = ({ listItems = [], keyPrefix, icon = null, backgroundColor = null, borderColor = null, containerStyles = null, textStyles = null, iconStyles = "text-teal-400", splitFromMobile = false }) => {
    // Split evenly rather than at a fixed index, so a 6-item list reads 3/3 instead of 5/1
    const splitAt = listItems.length > 5 ? Math.ceil(listItems.length / 2) : listItems.length;
    const col1 = listItems.slice(0, splitAt);
    const col2 = listItems.slice(splitAt);

    const Icon = icon ? <IconRenderer icon={icon} className={`h-4 w-4 mt-1 shrink-0 ${iconStyles}`} /> : null

    // Only fall back to a background when the caller hasn't set one — containerStyles
    // carries its own bg, and emitting a second bg-* class here left the two fighting
    // over Tailwind's stylesheet order
    const backgroundColorClass = backgroundColor ?? ""
    const borderColorClass = borderColor ? `border ${borderColor}` : ""
    const containerClasses = containerStyles ?? "p-4 rounded-md bg-gray-100"
    // default ink matches the default surface above — keep the two in step
    const textClasses = textStyles ?? "text-gray-950 text-sm"

    // With a second column of items, split side by side from md up — or from the
    // smallest screens when splitFromMobile is set
    const columnClasses = col2.length === 0
        ? "grid-cols-1"
        : (splitFromMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2")

    return (
        <div className={`grid ${columnClasses} gap-3 h-full ${backgroundColorClass} ${borderColorClass} ${containerClasses}`}>
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