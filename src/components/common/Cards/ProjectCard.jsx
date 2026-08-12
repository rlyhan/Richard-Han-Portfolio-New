import Image from "../Image"
import Pill from "../Pill"
import List from "../List"
import LinkButton from "../Buttons/LinkButton"

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
            // data-reveal is useScrollReveal's handle on the card; it sets opacity
            // and transform here.
            data-reveal
            className="group flex flex-col md:flex-row shadow-card rounded-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-card-hover"
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
