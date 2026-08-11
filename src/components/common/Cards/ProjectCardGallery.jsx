import Image from "../Image"
import Pill from "../Pill"

const ProjectCardGallery = ({ project, onClick }) => {
    return (
        // data-reveal is the reveal's handle on the card — see useScrollReveal,
        // which is what sets opacity and transform here.
        //
        // The transition is named property by property rather than left as bare
        // `transition`, which also covers opacity and transform — the two the
        // reveal writes on every frame. Left as it was, each of those writes would
        // be handed to a 150ms CSS transition on the way to the screen, and a scrub
        // that is meant to track the wheel would instead trail it by a fixed lag it
        // never asked for.
        <article data-reveal className="flex flex-col group bg-carbon-800 shadow-card rounded-lg overflow-hidden cursor-pointer transition-[background-color,box-shadow] hover:bg-carbon-700 hover:shadow-card-hover"
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
                    <h3 className="text-xl font-medium mb-2 text-paper">{project.name}</h3>
                    <p className="text-mute text-sm">
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