import { useState, useEffect, useMemo } from "react"
import classNames from "classnames"
import PageSection from "./common/PageSection"
import TabButton from "./common/Tabs/TabButton"
import PROJECTS from "../data/projects.data"
import ProjectCard from "./common/Cards/ProjectCard"
import ProjectCardGallery from "./common/Cards/ProjectCardGallery"
import IconButton from "./common/Buttons/IconButton"

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
    const [displayMode, setDisplayMode] = useState("default")

    const projectList = useMemo(() => {
        if (activeTab === "projects-all") return PROJECTS;
        const clientProject = activeTab === "projects-client";
        return PROJECTS.filter(p => (clientProject ? p.client : !p.client));
    }, [activeTab]);

    const featuredProjects = useMemo(() => projectList.filter(project => project.featured), [projectList])

    return (
        <PageSection id="projects">
            <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-semibold mb-8">Projects</h2>
                <div className="flex justify-between">
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
                    <div role="group" aria-label="Project display mode" className="flex gap-4 mb-6">
                        <IconButton type="list" onClick={() => setDisplayMode("default")} isActive={displayMode === "default"} />
                        <IconButton type="gallery" onClick={() => setDisplayMode("gallery")} isActive={displayMode === "gallery"} />
                    </div>
                </div>
                <div className={classNames("grid grid-cols-1 gap-6", {
                    "md:grid-cols-3": displayMode === "gallery",
                })}>
                    {featuredProjects.map((project) =>
                        displayMode === "gallery" ? (
                            <ProjectCardGallery key={project.id} project={project} />
                        ) : (
                            <ProjectCard key={project.id} project={project} />
                        )
                    )}
                </div>
            </div>
        </PageSection>
    )
}

export default Projects