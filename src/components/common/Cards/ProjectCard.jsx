import Image from "../Image"

const ProjectCard = ({ project }) => {
    return (
        <article className="group border border-white/10 rounded-lg overflow-hidden cursor-pointer flex justify-between gap-4">
            <div className="p-6 box-border flex-1 min-w-0">
                <h3 className="text-xl font-medium mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description}
                </p>
            </div>

            {project.images?.[0] && (
                <div className="overflow-hidden w-[220px] h-[128px] shrink-0">
                    <div className="w-full h-full relative transition-all duration-300 ease-in-out">
                        <Image
                            src={`/images/projects/${project.images[0]}`}
                            alt={project.name}
                            width={1280}
                            height={847}
                            includeHoverScale
                        />
                        <div className="absolute inset-0 z-10 bg-[#1a1a1a]/30 transition-colors duration-300 ease-in-out group-hover:bg-black/70" />
                    </div>
                </div>
            )}
        </article>

    )
}

export default ProjectCard