import Image from "../Image"
import Pill from "../Pill"
import List from "../List"
import LinkButton from "../Buttons/LinkButton"

const ProjectCard = ({ project }) => {
    return (
        <article className="flex flex-col overflow-hidden rounded-lg gap-4 border border-solid border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
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
            <div className="p-6 flex flex-col flex-1 min-w-0 gap-4">
                <header className="flex flex-col gap-4">
                    <h3 className="text-3xl text-white font-bold">{project.name}</h3>
                    <div className="flex gap-2">
                        {project.award && <Pill label={project.award.description} theme="award" />}
                        <Pill label={project.client ? "Client" : "Personal"} />
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                        {project.description}
                    </p>
                </header>
                <List listItems={project.work_involved} keyPrefix={`${project.id}-point`} />
                <div className="mt-auto flex gap-2">
                    <LinkButton href={project.url} label="Visit Site" />
                    {project.award && <LinkButton href={project.award.url} label="View Award" />}
                </div>
            </div>
        </article >

    )
}

export default ProjectCard