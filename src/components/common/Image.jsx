import classNames from "classnames"

const Image = ({ src, alt, width, height, includeHoverScale = false, className = "" }) => (
    <picture>
        <source type="image/webp" srcSet={src.replace(/\.(png|jpe?g)$/i, ".webp")} />
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            width={width}
            height={height}
            className={classNames(
                "h-full w-full object-cover",
                includeHoverScale && "transition-transform duration-300 ease-in-out group-hover:scale-110",
                className
            )}
        />
    </picture>
);


export default Image