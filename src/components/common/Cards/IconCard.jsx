const IconCard = ({ id, icon, text }) => {
    return (
        <div className="flex flex-col items-center p-12 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors">
            <div className="mb-4">
                {icon ? (
                    <img src={`./images/${icon}`} alt={`${id} icon`} className="w-12 h-12" />
                ) : (
                    <div className="w-12 h-12 bg-gray-600 flex items-center justify-center rounded-full">
                        <span className="text-white text-lg">{icon}</span>
                    </div>
                )}
            </div>
            <p className="text-center text-zinc-200 font-medium sm:text-lg leading-relaxed max-w-2xl mx-auto">{text}</p>
        </div>
    );
};

export default IconCard;