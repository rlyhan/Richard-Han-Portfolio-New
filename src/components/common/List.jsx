import classNames from "classnames";
import IconRenderer from "../icons/IconRenderer";

const List = ({ listItems = [], keyPrefix, icon = null, backgroundColor = null, containerStyles = null, textStyles = null }) => {
    const col1 = listItems.slice(0, 5);
    const col2 = listItems.slice(5);

    const Icon = icon ? <IconRenderer icon={icon} className="h-4 w-4 mt-1 shrink-0 text-cyan-600" /> : null

    const backgroundColorClass = backgroundColor ? backgroundColor : "bg-white/5"
    const containerClasses = containerStyles ? containerStyles : "p-4 rounded-md"
    const textClasses = textStyles ? textStyles : "text-white/80 text-xs sm:text-sm"

    return (
        <div className={classNames(`sm:pr-[48px] grid grid-cols-1 gap-3 h-full ${backgroundColorClass} ${containerClasses}`, {
            "md:grid-cols-2": col2.length > 0,
        })}>
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