import PageSection from "./common/PageSection"

const Projects = () => {
    return (
        <PageSection id="projects">
            <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-semibold mb-8">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article className="border border-white/10 p-6 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">Project One</h3>
                        <p className="text-gray-400 text-sm">
                            Brief description of the project.
                        </p>
                    </article>

                    <article className="border border-white/10 p-6 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">Project Two</h3>
                        <p className="text-gray-400 text-sm">
                            Brief description of the project.
                        </p>
                    </article>
                </div>
            </div>
        </PageSection>
    )
}

export default Projects