const IconCard = ({ id, icon, text }) => {
    return (
        <div className="flex flex-col items-center p-12 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
            <div className="mb-4">
                {icon ? (
                    <img src={`./images/${icon}`} alt={`${id} icon`} className="w-12 h-12" />
                ) : (
                    <div className="w-12 h-12 bg-gray-600 flex items-center justify-center rounded-full">
                        <span className="text-white text-lg">{icon}</span>
                    </div>
                )}
            </div>
            <p className="text-center text-white font-medium text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto">{text}</p>
        </div>
    );
};

export default IconCard;