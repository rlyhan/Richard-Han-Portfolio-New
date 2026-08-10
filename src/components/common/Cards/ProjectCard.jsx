import Image from "../Image"
import Pill from "../Pill"
import List from "../List"
import LinkButton from "../Buttons/LinkButton"

// Full write-up shown inside the modal
const ProjectDetail = ({ project }) => (
    <article className="flex flex-col overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
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
                <p className="text-white/80 text-md leading-relaxed">
                    {project.description}
                </p>
            </header>
            <List
                listItems={project.work_involved}
                keyPrefix={`${project.id}-point`}
                icon="tick"
                containerStyles="p-6 rounded-xl border border-white/20 bg-transparent"
                textStyles="text-sm text-white leading-relaxed"
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
            className="group flex flex-col md:flex-row bg-gray-500/85 border border-white/20 rounded-lg overflow-hidden cursor-pointer transition-colors hover:bg-gray-700 hover:border-white/40"
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
            <div className="p-5 md:p-4 flex flex-col flex-1 min-w-0 gap-3 md:gap-2">
                <header className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-medium font-heading uppercase text-white">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {project.award && <Pill label={project.award.description} theme="award-muted" />}
                        <Pill label={project.client ? "Client" : "Personal"} />
                        <Pill label="Visit Site" theme="solid" href={project.url} />
                        {project.award && <Pill label="View Award" theme="solid" href={project.award.url} />}
                    </div>
                    <p className="text-gray-50 text-sm leading-relaxed md:line-clamp-2">
                        {project.description}
                    </p>
                </header>
            </div>
        </article>
    )
}

export default ProjectCard
