import { useState, useMemo, useEffect, useRef } from "react"
import classNames from "classnames"
import PageSection from "./layout/PageSection"
import SectionHeading from "./common/SectionHeading"
import TabButton from "./common/Tabs/TabButton"
import { useTabFade } from "../hooks/useTabFade"
import { useScrollReveal } from "../hooks/useScrollReveal"
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

    // The grid below is one panel for all three categories, so switching tabs
    // swaps its contents without the element itself ever changing. This replays
    // the fade on that swap; see useTabFade for why it isn't a CSS animation.
    const panelRef = useRef(null)
    useTabFade(panelRef, activeTab)

    // Keyed on both, because both change which cards are in the grid and how
    // they are arranged in it: the tab re-filters the list, and the display mode
    // takes it from one column to a gallery of two or three across. Either way
    // the rows the reveal measured have stopped existing.
    //
    // Alongside the fade above rather than instead of it. They answer different
    // questions — the fade is what covers the swap itself, this is what carries
    // the cards below the fold in as the reader scrolls to them — and they
    // compose cleanly, since the panel's opacity and a card's multiply.
    useScrollReveal(panelRef, `${activeTab}:${displayMode}`)

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
        <PageSection id="projects" additionalClasses="mb-4">
            <div className="max-w-6xl mx-auto w-full">
                <SectionHeading label="Projects" />
                <div className="flex justify-between">
                    <div role="tablist" className="flex gap-4 mb-6" aria-label="Project category tabs">
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
                <div ref={panelRef} className={classNames("grid gap-6", {
                    "grid-cols-1": displayMode === "default",
                    "md:grid-cols-2 lg:grid-cols-3": displayMode === "gallery",
                })}>
                    {featuredProjects.map((project) =>
                        displayMode === "gallery" ? (
                            <ProjectCardGallery key={project.id} project={project} onClick={() => openProject(project)} />
                        ) : (
                            <ProjectCard key={project.id} project={project} onClick={() => openProject(project)} />
                        )
                    )}
                </div>
            </div>
            {/* Modal */}
            {
                isModalOpen && selectedProject && (
                    <Modal project={selectedProject} modalTitle={selectedProject.name} isOpen={isModalOpen} onClose={closeProject}>
                        <ProjectCard project={selectedProject} isModalContent={true} />
                    </Modal>
                )
            }
        </PageSection >
    )
}

export default Projects