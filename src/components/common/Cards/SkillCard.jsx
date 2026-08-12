import IconRenderer from "../../icons/IconRenderer";

const SkillCard = ({ icon, text }) => {
    return (
        // square only from md up, where the cards sit three across; at full width on
        // mobile a square is mostly empty space, so it shrinks to the copy
        //
        // data-reveal is useScrollReveal's handle; it sets opacity and transform here
        <div data-reveal className="md:aspect-square flex flex-col items-center justify-center gap-3 md:gap-4 px-5 py-4 md:p-5 rounded-xl bg-transparent border border-neon/50 hover:border-neon hover:shadow-card-hover transition-colors">
            <IconRenderer icon={icon} className="h-8 w-8 shrink-0 text-neon" />
            <p className="text-center text-paper text-sm md:text-base font-medium leading-relaxed">{text}</p>
        </div>
    );
};

export default SkillCard;
