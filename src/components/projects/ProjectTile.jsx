import cn from "classnames";
import AwardIcon from "../icons/AwardIcon";

// The Projects page's small-caps voice: each tile's number and category, and the
// award mark inside the category line. Tighter tracking than the hero's spread — at
// 9px in a plate this narrow, the hero's 0.18em pushes a two-word category into a
// wrap.
const EYEBROW_CLASS =
    "font-epilogue text-[0.5625rem] font-medium uppercase leading-none tracking-[0.06em]";

// One tile of the Projects grid: a vignetted well with the shot matted whole inside
// it and a caption plate framed over the foot of it.
//
// It is the hero card's frame at three-column size — see HomeProjectCard for why the
// shots are matted rather than cropped, and why the plate sits ON the well instead of
// in a strip under it. Two things differ, and both follow from the size:
//
//   the ground   `bg-frame` rather than flat `bg-well`. The same warm tone,
//                vignetted, because a cell this large reads as a slab under one flat
//                fill — see tailwind.config.
//   no zoom      the hero's cards swell on hover to fill their frame. Here the frame
//                is generous enough that the shot already fills it, and a 14-tile
//                grid that moves under the cursor reads as restless.
//
// The number is the project's place in the whole list, not in the filtered one. The
// filters hide tiles rather than renumbering them, so a project keeps the same number
// whichever filter is up — a number that moved would read as a different project.
//
// Nothing here is interactive, and the tile carries no hover state or focus ring for
// the same reason: the write-up each one leads to is a page of its own, and those
// pages are not built yet. When they are, the tile becomes an anchor around this
// markup — which is why the title is a real heading rather than a label on a button.
// A button's children are presentational to a screen reader, so the fourteen titles
// would stop being headings the moment a role went on the article.
const ProjectTile = ({ project, number }) => {
    const { name, category, award, images } = project;
    const image = images?.[0];

    return (
        <article
            // data-reveal is useScrollReveal's handle on the tile; it sets opacity
            // and transform here.
            data-reveal
            // The tiles draw the grid rather than sitting in one: each cell's right
            // and bottom edges are its neighbour's left and top, and the page's own
            // edges close the two no cell owns — the toolbar's rule above, the
            // viewport at the sides.
            //
            // A height rather than an aspect ratio. The shots are three different
            // shapes and the plate has a fixed depth, so it is the frame that has to
            // be a known size for the matting above it to be even.
            className="relative h-[clamp(21.25rem,60vw,27.5rem)] overflow-hidden border-r border-b border-grid bg-frame md:h-[clamp(17.5rem,44vw,25rem)] lg:h-[clamp(18.75rem,34vw,28.75rem)]"
        >
            {/* The frame the shot hangs in. Its foot stops well above the plate, so
                the object stays whole and the plate has nothing behind it to show
                through. */}
            <div className="absolute inset-x-5 top-3 bottom-24 flex items-center justify-center overflow-hidden md:inset-x-[1.625rem] md:top-4">
                {image ? (
                    <img
                        src={`/images/projects/${image}`}
                        alt={`The ${name} site`}
                        loading="lazy"
                        decoding="async"
                        // No width/height: the box is a fixed inset of a fixed-height
                        // tile, so there is no space to reserve — nothing here can
                        // shift when the file lands.
                        className="block h-full w-full object-contain object-center"
                    />
                ) : (
                    // The three oldest projects have no shot. An empty frame would
                    // read as an image that failed; a plate in the page's own card
                    // tone reads as a project without one.
                    <div aria-hidden="true" className="h-full w-full border border-grid bg-shell" />
                )}
            </div>

            {/* The plate: number and title on one line, category under the title.
                A minimum depth rather than a set one, so a title that has to wrap
                grows the plate instead of spilling out of it. */}
            <div className="absolute inset-x-3.5 bottom-3.5 grid min-h-[3.625rem] grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-[0.5625rem] gap-y-1.5 border border-grid bg-cream px-4 pt-[0.8125rem] pb-3">
                <span className={cn(EYEBROW_CLASS, "text-ash")}>
                    {String(number).padStart(2, "0")}
                </span>

                <h2 className="font-urbanist truncate text-[1.1875rem] leading-none font-bold text-ink">
                    {name}
                </h2>

                {/* The award rides in the category line rather than taking a row of
                    its own: it is a fact about the project of the same weight, and a
                    third line would deepen every plate on the page for the one tile
                    that has one. */}
                <p
                    className={cn(
                        EYEBROW_CLASS,
                        "col-start-2 row-start-2 flex min-w-0 items-center gap-2 self-end text-ash",
                    )}
                >
                    <span className="truncate">{category}</span>

                    {award && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-well px-[0.5625rem] py-1 leading-[0.6875rem] font-bold text-cream">
                            <AwardIcon className="mr-[0.3125rem] h-[0.6875rem] w-[0.6875rem]" />
                            {award.description}
                        </span>
                    )}
                </p>
            </div>
        </article>
    );
};

export default ProjectTile;
