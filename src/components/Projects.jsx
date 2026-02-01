import { useState, useMemo } from "react"
import PageSection from "./common/PageSection"
import TabButton from "./common/Tabs/TabButton"
import PROJECTS from "../data/projects.data"

const tabs = [
    {
        id: "projects-all",
        tabName: "All"
    },
    {
        id: "projects-client",
        tabName: "Client"
    },
    {
        id: "projects-personal",
        tabName: "Personal"
    }
]

const Projects = () => {
    const [activeTab, setActiveTab] = useState("projects-all")

    const projectList = useMemo(() => {
        if (activeTab === "projects-all") return PROJECTS;
        const clientProject = activeTab === "projects-client";
        return PROJECTS.filter(p => (clientProject ? p.client : !p.client));
    }, [activeTab]);

    return (
        <PageSection id="projects">
            <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-semibold mb-8">Projects</h2>
                <div role="tablist" className="flex gap-4 mb-6">
                    {tabs.map((t) => (
                        <TabButton
                            key={t.id}
                            id={t.id}
                            tabName={t.tabName}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {
                        projectList.map(project =>
                            <article key={project.id} className="border border-white/10 rounded-lg overflow-hidden">
                                {project["images"] &&
                                    <div className="relative hover:scale-103 transition ease-in-out">
                                        <div className="absolute inset-0 bg-[#1a1a1a]/30 hover:bg-black/40 transition ease-in-out" />
                                        <img src={`/images/projects/${project["images"][0]}`} alt={project.name} className="object-cover" />
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
                </div>
            </div>
        </PageSection>
    )
}

export default Projects