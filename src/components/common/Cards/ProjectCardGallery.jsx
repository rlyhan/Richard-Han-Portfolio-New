import Image from "../Image"

const ProjectCardGallery = ({ project }) => {
    return (
        <article className="group border border-white/10 rounded-lg overflow-hidden cursor-pointer">
            {project["images"] &&
                <div className="overflow-hidden">
                    <div className="relative transition-all duration-300 ease-in-out">
                        <Image src={`/images/projects/${project["images"][0]}`} alt={project.name} width={1280} height={847} includeHoverScale />

                        <div className="absolute inset-0 z-10 bg-[#1a1a1a]/30 transition-colors duration-300 ease-in-out group-hover:bg-black/70" />

                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <div
                                className="opacity-0 translate-y-2 group-hover:opacity-100
                                            transition-all duration-300 ease-out
                                            bg-white text-black px-5 py-2 rounded-md text-sm font-medium"
                            >
                                View project
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="p-6">
                <h3 className="text-xl font-medium mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm">
                    {project.description}
                </p>
            </div>
        </article>
    )
}

export default ProjectCardGallery