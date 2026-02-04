import { useState, useMemo, useEffect } from "react"
import classNames from "classnames"
import PageSection from "./layout/PageSection"
import SectionHeading from "./common/SectionHeading"
import TabButton from "./common/Tabs/TabButton"
import PROJECTS from "../data/projects.data"
import ProjectCard from "./common/Cards/ProjectCard"
import ProjectCardGallery from "./common/Cards/ProjectCardGallery"
import IconButton from "./common/Buttons/IconButton"
import Modal from "./common/Modal"

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    const projectList = useMemo(() => {
        if (activeTab === "projects-all") return PROJECTS;
        const clientProject = activeTab === "projects-client";
        return PROJECTS.filter(p => (clientProject ? p.client : !p.client));
    }, [activeTab]);

    const featuredProjects = useMemo(() => projectList.filter(project => project.featured), [projectList])

    const openProject = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeProject = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isModalOpen);
        return () => document.body.classList.remove("overflow-hidden");
    }, [isModalOpen]);

    return (
        <PageSection id="projects">
            <div className="max-w-6xl mx-auto w-full">
                <SectionHeading label="Projects" />
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
                    <div role="group" aria-label="Project display mode" className="hidden md:flex gap-4 mb-6">
                        <IconButton type="list" onClick={() => setDisplayMode("default")} isActive={displayMode === "default"} />
                        <IconButton type="gallery" onClick={() => setDisplayMode("gallery")} isActive={displayMode === "gallery"} />
                    </div>
                </div>
                <div className={classNames("grid gap-6", {
                    "grid-cols-1 md:grid-cols-2": displayMode === "default",
                    "md:grid-cols-2 lg:grid-cols-3": displayMode === "gallery",
                })}>
                    {featuredProjects.map((project) =>
                        displayMode === "gallery" ? (
                            <ProjectCardGallery key={project.id} project={project} onClick={() => openProject(project)} />
                        ) : (
                            <ProjectCard key={project.id} project={project} />
                        )
                    )}
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && selectedProject && (
                <Modal project={selectedProject} modalTitle={selectedProject.name} isOpen={isModalOpen} onClose={closeProject}>
                    <ProjectCard project={selectedProject} isModalContent={true} />
                </Modal>
            )}
        </PageSection>
    )
}

export default Projects