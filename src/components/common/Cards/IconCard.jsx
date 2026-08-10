const IconCard = ({ id, icon, text }) => {
    return (
        <div className="flex flex-col items-center p-8 rounded-xl bg-carbon-800 shadow-card transition-colors">
            <div className="mb-4">
                {icon ? (
                    <img src={`./images/${icon}`} alt={`${id} icon`} className="w-12 h-12" />
                ) : (
                    <div className="w-12 h-12 bg-carbon-600 flex items-center justify-center rounded-full">
                        <span className="text-neon text-lg">{icon}</span>
                    </div>
                )}
            </div>
            <p className="text-center text-paper font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto">{text}</p>
        </div>
    );
};

export default IconCard;