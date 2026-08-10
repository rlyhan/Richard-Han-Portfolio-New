import Image from "../Image"
import Pill from "../Pill"
import List from "../List"
import LinkButton from "../Buttons/LinkButton"

// Full write-up shown inside the modal
const ProjectDetail = ({ project }) => (
    <article className="flex flex-col overflow-hidden">
        {project.images?.[0] && (
            <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="block group overflow-hidden"
            >
                <Image
                    src={`/images/projects/${project.images[0]}`}
                    alt={project.name}
                    width={1280}
                    height={847}
                    includeHoverScale
                    withHoverOverlay
                    hoverLabel="View project"
                />
            </a>
        )}
        <div className="p-6 flex flex-col flex-1 min-w-0 gap-6">
            <header className="flex flex-col gap-4">
                <h2 className="text-3xl text-white font-bold" id="modal-title">{project.name}</h2>
                <div className="flex flex-wrap gap-2">
                    {project.award && <Pill label={project.award.description} theme="award" />}
                    <Pill label={project.client ? "Client" : "Personal"} />
                </div>
                <p className="text-mute text-base leading-relaxed">
                    {project.description}
                </p>
            </header>
            <List
                listItems={project.work_involved}
                keyPrefix={`${project.id}-point`}
                icon="tick"
                // A raised card, like every other list on the site. This is the one
                // place a shadow pulls its weight: the panel is light enough for
                // black to actually darken it, so the edge here is 1.82:1 — where
                // the same shadow on the page manages 1.10:1.
                // carbon-700, not 800: against a carbon-850 panel the usual card
                // colour is only 1.17:1, one ramp step too close.
                containerStyles="p-6 rounded-xl bg-carbon-700 shadow-card"
                textStyles="text-sm text-paper leading-relaxed"
            />
            <div className="mt-auto flex flex-col md:flex-row gap-2">
                <LinkButton href={project.url} label="Visit Site" useExternalIcon />
                {project.award && <LinkButton href={project.award.url} label="View Award" useExternalIcon />}
            </div>
        </div>
    </article>
)

const ProjectCard = ({ project, onClick, isModalContent = false }) => {
    if (isModalContent) return <ProjectDetail project={project} />

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <article
            // No fill: the neon outline around the copy is what draws this card, so
            // a surface underneath would only compete with it. shadow-card is
            // unaffected — a box-shadow hangs off the article's own border box, not
            // off its background, so the whole silhouette keeps its lift even
            // though the box is see-through. overflow-hidden stays: it's what
            // rounds the image into the card's corners.
            // transition, not transition-colors: the shadow has to animate too.
            className="group flex flex-col md:flex-row shadow-card rounded-lg overflow-hidden cursor-pointer transition hover:shadow-card-hover"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${project.name} — more info`}
        >
            {project.images?.[0] && (
                <Image
                    src={`/images/projects/${project.images[0]}`}
                    alt={project.name}
                    width={1280}
                    height={847}
                    includeHoverScale
                    withHoverOverlay
                    hoverLabel="More info"
                    className="md:w-64 md:shrink-0 md:self-start md:aspect-[1280/847]"
                />
            )}
            {/* The outline wraps the copy only, so both its corners and its open
                side have to follow the image — and which side that is flips with
                the layout. Stacked, the image is above, so the TOP edge is the one
                that would draw a line between the two; side-by-side it's the left.
                Dropping border-l unconditionally would leave the mobile card's
                outline hanging open down its left side.
                Same story for the radii: square where the outline butts against the
                image, rounded where it forms one of the card's own corners. */}
            <div className="p-5 md:p-4 flex flex-col flex-1 min-w-0 gap-3 md:gap-2 border border-t-0 md:border-t md:border-l-0 border-neon/40 rounded-b-lg md:rounded-bl-none md:rounded-tr-lg transition-colors group-hover:border-neon">
                <header className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-medium font-heading uppercase text-paper">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {project.award && <Pill label={project.award.description} theme="award" href={project.award.url} />}
                        <Pill label={project.client ? "Client" : "Personal"} theme="card" />
                        <Pill label="Visit Site" theme="solid" href={project.url} />
                    </div>
                    <p className="text-mute text-sm leading-relaxed md:line-clamp-2">
                        {project.description}
                    </p>
                </header>
            </div>
        </article>
    )
}

export default ProjectCard
