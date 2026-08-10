import Image from "../Image"
import Pill from "../Pill"

const ProjectCardGallery = ({ project, onClick }) => {
    return (
        <article className="flex flex-col group bg-gray-500 border border-white/20 rounded-lg overflow-hidden cursor-pointer transition-colors hover:bg-gray-600 hover:border-white/40"
            onClick={onClick}>
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
            <div className="p-6 flex flex-col flex-1 gap-4">
                <header className="mb-auto">
                    <h3 className="text-xl font-medium mb-2 text-white">{project.name}</h3>
                    <p className="text-gray-50 text-sm">
                        {project.description}
                    </p>
                </header>
                <div className="flex gap-2 mt-auto">
                    {project.award && <Pill label={project.award.description} theme="award-muted" />}
                    <Pill label={project.client ? "Client" : "Personal"} />
                </div>
            </div>
        </article>
    )
}

export default ProjectCardGallery