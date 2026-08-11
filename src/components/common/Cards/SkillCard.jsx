import IconRenderer from "../../icons/IconRenderer";

// The one card in the set with no fill: it reads as a card off the neon outline
// alone, so the border carries the full boundary rather than sharing it with the
// carbon-800 fill + shadow pairing the other cards use. neon/50 is the floor —
// any fainter and the square disappears against the page.
const SkillCard = ({ icon, text }) => {
    return (
        // square only from md up, where the cards sit three across. At full width
        // on mobile a square is mostly empty space, so it shrinks to the copy
        //
        // data-skill-card is the reveal's handle on the card — see
        // useSkillCardReveal, which is what sets opacity and transform here
        <div data-skill-card className="md:aspect-square flex flex-col items-center justify-center gap-3 md:gap-4 px-5 py-4 md:p-5 rounded-xl bg-transparent border border-neon/50 hover:border-neon hover:shadow-card-hover transition-colors">
            <IconRenderer icon={icon} className="h-8 w-8 shrink-0 text-neon" />
            <p className="text-center text-paper text-sm md:text-base font-medium leading-relaxed">{text}</p>
        </div>
    );
};

export default SkillCard;
