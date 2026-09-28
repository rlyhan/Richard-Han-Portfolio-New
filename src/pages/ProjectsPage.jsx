import { useMemo, useRef, useState } from "react";
import PageSection from "../components/layout/PageSection";
import PageMasthead from "../components/layout/PageMasthead";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectTile from "../components/projects/ProjectTile";
import { usePage } from "../routes/RouterContext";
import { useTabSelect } from "../hooks/useTabSelect";
import { useScrollReveal } from "../hooks/useScrollReveal";
import PROJECTS, { PROJECTS_HEADING, PROJECTS_NOTE } from "../data/projects.data";

// `all` is not a category, which is why the predicate is per filter rather than a
// field read off the project: the list's own flag is `client`, and "personal" is the
// absence of it rather than a value of its own.
const FILTERS = [
    { id: "all", label: "All", matches: () => true },
    { id: "client", label: "Client", matches: (project) => project.client },
    { id: "personal", label: "Personal", matches: (project) => !project.client },
];

// The number beside each title, worked out once off the full list. The filters hide
// tiles rather than renumbering them, so a project keeps its number whichever filter
// is up — see ProjectTile.
const NUMBERED_PROJECTS = PROJECTS.map((project, i) => ({ project, number: i + 1 }));

// The Projects page: a masthead, a rule carrying the filters and the count, and the
// whole list as a grid of framed shots. Its own chunk, which is where the project
// data lives.
//
// Every project, not a featured subset — the count on the rule is the point of the
// page ("14 / 14"), and a list that silently left three out could not state it.
//
// The tiles lead nowhere yet. Each project's write-up belongs on a page of its own and
// those pages are the next piece of work, so until they exist a tile is a framed shot
// with a caption and nothing to click — see ProjectTile, which carries no hover or
// focus state for that reason.
//
// It ends where its last tile does. Only the homepage hands over on the scroll — see
// RouterProvider — so the foot of this page is the foot of the document, and the way
// on from here is the nav bar pinned across it.
//
// The palette is the hero's, as About's is: cream ground, ink copy, a hairline between
// every band. The one dark thing on the page is the frame each shot is matted on,
// which is the hero's well seen at a larger size.
//
// contained: false — the rule above the grid and the grid's own seams run to the
// viewport edge, so the page frame's max width and gutter would cut every line short.
// The masthead and the toolbar state the hero's gutter instead; the grid has none.
const ProjectsPage = () => {
    const { isArriving } = usePage();

    const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);

    const gridRef = useRef(null);

    // The press lands the toolbar at the top of the viewport, so the filtered grid
    // opens from its first tile rather than part-way down.
    //
    // gridRef as the panel because one grid serves all three filters: pressing a
    // filter swaps its contents without the element changing, so the fade over that
    // swap has to be replayed by hand. See useTabSelect for why it isn't a CSS
    // animation.
    const { rowRef, selectTab } = useTabSelect(activeFilter, setActiveFilter, {
        panelRef: gridRef,
    });

    // Keyed on the filter: it re-filters the grid, so the rows the reveal measured are
    // gone. Alongside the toolbar's fade rather than instead of it — the fade covers
    // the swap, this carries in the tiles below the fold — and they compose, since the
    // grid's opacity and a tile's multiply.
    //
    // Not while the page is still arriving: a swap holds it a screen below the fold
    // while it travels, and rows measured there are rows measured in the wrong place.
    useScrollReveal(gridRef, activeFilter, { enabled: !isArriving });

    const shown = useMemo(() => {
        const { matches } = FILTERS.find((filter) => filter.id === activeFilter);
        return NUMBERED_PROJECTS.filter((entry) => matches(entry.project));
    }, [activeFilter]);

    return (
        <PageSection
            id="projects"
            contained={false}
            // bg-cream: its own ground rather than the body's. A page staged below
            // another one is in that page's document, and the body is carrying the
            // ground of whichever page is in front.
            //
            // No stacking context of its own, unlike About: About has to cover the
            // sticky hero it shares a document with, and this page arrives by a swap,
            // over nothing.
            additionalClasses="flex flex-col bg-cream font-epilogue text-ink"
        >
            <PageMasthead heading={PROJECTS_HEADING} note={PROJECTS_NOTE} />

            <section aria-label="Project list" className="border-t border-grid">
                <ProjectsToolbar
                    rowRef={rowRef}
                    filters={FILTERS}
                    activeFilter={activeFilter}
                    onSelect={selectTab}
                    shown={shown.length}
                    total={NUMBERED_PROJECTS.length}
                />

                {/* One column, two, then three. No gaps: the tiles draw the grid
                    rather than sitting in one — see ProjectTile. */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {shown.map(({ project, number }) => (
                        <ProjectTile key={project.id} project={project} number={number} />
                    ))}
                </div>
            </section>
        </PageSection>
    );
};

export default ProjectsPage;
