import classNames from "classnames";

const Image = ({
    src,
    alt,
    width,
    height,
    includeHoverScale = false,
    withHoverOverlay = false,
    hoverLabel = "View project",
    className = "",
}) => {
    return (
        <div className={classNames("relative overflow-hidden", className)}>
            {/* Image */}
            <picture>
                <source type="image/webp" srcSet={src} />
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    className={classNames(
                        "h-full w-full object-cover",
                        includeHoverScale &&
                        "transition-transform duration-300 ease-in-out group-hover:scale-110"
                    )}
                />
            </picture>

            {/* Optional hover overlay */}
            {withHoverOverlay && (
                <>
                    {/* Dark overlay */}
                    <div
                        className="
              pointer-events-none
              absolute inset-0 z-10
              bg-[#1a1a1a]/20
              transition-colors duration-300 ease-in-out
              group-hover:bg-black/70
            "
                    />

                    {/* CTA */}
                    <div
                        className="
              pointer-events-none
              absolute inset-0 z-20
              flex items-center justify-center
            "
                    >
                        <div
                            className="
                opacity-0 translate-y-2
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 ease-out
                bg-white text-black
                px-5 py-2 rounded-md
                text-sm font-medium
              "
                        >
                            {hoverLabel}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Image;
