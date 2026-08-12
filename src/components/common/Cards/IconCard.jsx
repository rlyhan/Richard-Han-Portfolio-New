const IconCard = ({ id, icon, text }) => {
    return (
        // data-reveal is useScrollReveal's handle; it sets opacity and transform here
        <div data-reveal className="flex items-center gap-6 p-8 rounded-xl bg-transparent border border-neon transition-colors">
            <div className="shrink-0">
                {icon ? (
                    <img src={`./images/${icon}`} alt={`${id} icon`} className="w-12 h-12" />
                ) : (
                    <div className="w-12 h-12 bg-carbon-600 flex items-center justify-center rounded-full">
                        <span className="text-neon text-lg">{icon}</span>
                    </div>
                )}
            </div>
            <p className="text-left text-paper font-medium text-base md:text-lg leading-relaxed">{text}</p>
        </div>
    );
};

export default IconCard;