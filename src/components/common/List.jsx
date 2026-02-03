import TickIcon from "../icons/TickIcon"

const List = ({ listItems = [], keyPrefix, bgColorClass = "bg-white/5", fontWeightClass = "font-normal" }) => {
    return (
        <ul className={`${bgColorClass} rounded-md p-4 space-y-2`}>
            {listItems.map((listItem, i) => (
                <li
                    key={`${keyPrefix}-${i}`}
                    className="flex items-start gap-3"
                >
                    <TickIcon className="h-4 w-4 mt-1 shrink-0 text-yellow-300/70" />
                    <span className={`text-white/80 text-sm ${fontWeightClass}`}>{listItem}</span>
                </li>
            ))}
        </ul>
    );
};


export default List