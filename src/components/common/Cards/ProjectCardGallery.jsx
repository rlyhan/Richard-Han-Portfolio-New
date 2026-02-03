import Image from "../Image"
import Pill from "../Pill"

const ProjectCardGallery = ({ project }) => {
    return (
        <article className="group border border-white/10 rounded-lg overflow-hidden cursor-pointer">
            {project["images"] &&
                <Image
                    src={`/images/projects/${project.images[0]}`}
                    alt={project.name}
                    width={1280}
                    height={847}
                    includeHoverScale
                    withHoverOverlay
                    hoverLabel="More info"
                />
            }
            <div className="p-6 flex flex-col">
                <header className="mb-auto">
                    <h3 className="text-xl font-medium mb-2">{project.name}</h3>
                    <p className="text-gray-400 text-sm">
                        {project.description}
                    </p>
                </header>
                <div className="flex gap-2 mt-4">
                    {project.award && <Pill label={project.award.description} theme="award" />}
                    <Pill label={project.client ? "Client" : "Personal"} />
                </div>
            </div>
        </article>
    )
}

export default ProjectCardGallery