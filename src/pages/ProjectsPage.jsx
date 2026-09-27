import { useMemo, useRef, useState } from "react"
import classNames from "classnames"
import PageSection from "../components/layout/PageSection"
import SectionHeading from "../components/common/SectionHeading"
import TabButton from "../components/common/Tabs/TabButton"
import { useTabSelect } from "../hooks/useTabSelect"
import { useScrollReveal } from "../hooks/useScrollReveal"
import PROJECTS from "../data/projects.data"
import ProjectCard from "../components/common/Cards/ProjectCard"
import ProjectCardGallery from "../components/common/Cards/ProjectCardGallery"
import IconButton from "../components/common/Buttons/IconButton"
import Modal from "../components/common/Modal"

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

// The Projects page: the filterable list. Its own chunk, which is where the project
// data and the modal live.
//
// It ends where its last card does. Only the homepage hands over on the scroll — see
// RouterProvider — so the foot of this page is the foot of the document, and the way
// on from here is the nav bar.
const ProjectsPage = () => {
    const [activeTab, setActiveTab] = useState("projects-all")
    const [displayMode, setDisplayMode] = useState("default")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    const panelRef = useRef(null)

    // The click lands the row at the top of the viewport, so the filtered list opens
    // from its first card rather than part-way down.
    //
    // panelRef because one panel serves all three categories: switching tabs swaps its
    // contents without the element changing, so the fade over that swap has to be
    // replayed by hand. See useTabSelect for why it isn't a CSS animation.
    const { rowRef, selectTab } = useTabSelect(activeTab, setActiveTab, { panelRef })

    // Keyed on both: the tab re-filters the list and the display mode takes it from
    // one column to a gallery, so either way the rows the reveal measured are gone.
    //
    // Alongside the fade rather than instead of it — the fade covers the swap, this
    // carries in the cards below the fold — and they compose, since the panel's
    // opacity and a card's multiply.
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

    return (
        <>
            {/* bg-carbon-900: its own ground rather than the body's. A page staged
                below another one is in that page's document, and the body is carrying
                the ground of whichever page is in front — which on the way in here is
                About's cream. */}
            <PageSection id="projects" additionalClasses="mb-4 bg-carbon-900">
                <div className="max-w-6xl mx-auto w-full">
                    <SectionHeading label="Projects" />
                    {/* The ref sits on the whole row, not the tablist: the display-mode
                        buttons share the line, so the row's top edge is what a tab click
                        lands against. */}
                    <div ref={rowRef} className="flex justify-between">
                        <div role="tablist" className="flex gap-4 mb-6" aria-label="Project category tabs">
                            {tabs.map((t) => (
                                <TabButton
                                    key={t.id}
                                    id={t.id}
                                    tabName={t.tabName}
                                    activeTab={activeTab}
                                    setActiveTab={selectTab}
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
            </PageSection >

            {/* Modal. Outside the section, because the section carries the transform that
                lands it under the handoff from About — and a transformed ancestor becomes
                the containing block for `position: fixed`, so the scrim would size itself
                against the section instead of the viewport. */}
            {
                isModalOpen && selectedProject && (
                    <Modal project={selectedProject} modalTitle={selectedProject.name} isOpen={isModalOpen} onClose={closeProject}>
                        <ProjectCard project={selectedProject} isModalContent={true} />
                    </Modal>
                )
            }
        </>
    )
}

export default ProjectsPage