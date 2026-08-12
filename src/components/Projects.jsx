import { useState, useMemo, useRef } from "react"
import classNames from "classnames"
import PageSection from "./layout/PageSection"
import SectionHeading from "./common/SectionHeading"
import TabButton from "./common/Tabs/TabButton"
import ScrollCue from "./common/Buttons/ScrollCue"
import { useTabSelect } from "../hooks/useTabSelect"
import { useScrollReveal } from "../hooks/useScrollReveal"
import { useSectionHandoff } from "../hooks/useSectionHandoff"
import { useKeyShortcut } from "../hooks/useKeyShortcut"
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

    const panelRef = useRef(null)
    const contentRef = useRef(null)
    const runwayRef = useRef(null)

    // The click lands the row at the top of the viewport, so the filtered list opens
    // from its first card rather than part-way down.
    //
    // panelRef because one panel serves all three categories: switching tabs swaps its
    // contents without the element changing, so the fade over that swap has to be
    // replayed by hand. See useTabSelect for why it isn't a CSS animation.
    const { rowRef, selectTab } = useTabSelect(activeTab, setActiveTab, { panelRef })

    // The hesitation between Projects and Contact, on the same terms as About's — see
    // useSectionHandoff.
    const { scrollToNext, isCueVisible } = useSectionHandoff({
        contentRef,
        runwayRef,
        nextSelector: "#contact",
    })

    // Space is the cue's gesture from the keyboard, bound only while the cue is up:
    // anywhere else on the page it goes back to being page-down. Never behind the
    // modal, where the press belongs to the panel and the page is locked anyway.
    useKeyShortcut("Space", scrollToNext, { enabled: isCueVisible && !isModalOpen })

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
            <PageSection id="projects" additionalClasses="mb-4">
                {/* Held by useSectionHandoff once its bottom edge reaches the middle of
                    the viewport, dissolving as the runway below passes: the hesitation
                    before Contact. */}
                <div ref={contentRef} className="max-w-6xl mx-auto w-full">
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

                {/* The runway: the scroll the hesitation is spent against, before the
                    handoff takes over into Contact. Carries no content, so its only job
                    is height — and it's what every trigger in the handoff measures
                    against, hence the ref.

                    Reduced motion collapses it, back to Contact following Projects
                    directly: with the park and its dissolve gone there would be nothing
                    to watch, and it would read as a dead screen. */}
                <div ref={runwayRef} aria-hidden="true" className="h-[80svh] motion-reduce:h-0" />
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

            {/* Up only while the content is held, so it never floats over a section
                already on screen — and never behind the modal, where it would sit under
                the scrim, still in the tab order, offering a scroll the modal has
                locked. */}
            <ScrollCue
                onClick={scrollToNext}
                visible={isCueVisible && !isModalOpen}
                label="Scroll to the Contact section"
            />
        </>
    )
}

export default Projects