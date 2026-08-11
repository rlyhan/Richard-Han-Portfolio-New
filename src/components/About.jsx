import { useRef } from "react"
import PageSection from "./layout/PageSection"
import Article from "./common/Article"
import Tabs from "./common/Tabs/Tabs"
import SectionHeading from "./common/SectionHeading"
import { WORK, TECH, SKILLS, INTERESTS } from "../data/work.data"
import IconCard from "./common/Cards/IconCard"
import SkillCard from "./common/Cards/SkillCard"
import { useTextColorSweep } from "../hooks/useTextColorSweep"

const About = () => {
    const introRef = useRef(null)

    useTextColorSweep(introRef)

    const tabs = [
        {
            id: "experience",
            tabName: "Experience",
            useGrid: false,
            render: () => (
                <>
                    {WORK.map((workItem) => (
                        <Article key={workItem.id} item={workItem} icon="default" />
                    ))}
                </>
            ),
        },
        {
            id: "technologies",
            tabName: "Technologies",
            useGrid: true,
            render: () => (
                <>
                    {TECH.map((techItem) => (
                        <Article key={techItem.id}
                            item={techItem}
                            textStyles="text-paper text-sm font-medium"
                            icon={techItem.icon}
                            includeHeaderIcon
                            useListIcons={false}
                            alignHeaders
                            splitListFromMobile
                        />
                    ))}
                </>
            ),
        },
        {
            id: "Interests",
            tabName: "Interests",
            useGrid: false,
            render: () => (
                <div className="grid grid-cols-1 gap-4">
                    {INTERESTS.map((interest) => (
                        <IconCard key={interest.id} icon={interest.icon} text={interest.text} />
                    ))}
                </div>
            ),
        }
    ];

    // The opaque background is what makes the hero handoff read as a cover: the
    // hero sits sticky underneath, and About has to paint over all of it. Hence
    // the width split — the fill spans the full column while the copy stays at
    // its 4xl measure, since a 4xl fill would leave the hero's display lines
    // showing down both edges as About rises.
    return (
        <PageSection id="about" additionalClasses="relative z-10 bg-carbon-900">
            <div className="max-w-4xl mx-auto">
                <SectionHeading label="About" />
                <div ref={introRef} className="pr-8 md:pr-24">
                    <p className="text-paper text-xl md:text-4xl mb-10 leading-relaxed">
                        Hi! I'm Richard, and I have been building web applications for a range of clients since 2020.
                    </p>
                    <p className="text-paper text-xl md:text-4xl mb-10 leading-relaxed">
                        I'm driven by a passion for building modern, fluid, interactive user experiences, and a commitment to the collaborative and technical processes that build the most performant, maintainable, and brand impactful solutions possible.
                    </p>
                    <p className="text-paper text-xl md:text-4xl mb-10 leading-relaxed">
                        I have a strong background in React/Next.js driven frontend development, Node.js and Django based backend architectures, and integrating headless CMS like Sanity, Contentful and Kontent.ai, eCommerce platforms like Shopify, and large scale domain data APIs tailored to business needs. 
                    </p>

                    <p className="text-paper text-xl md:text-4xl mb-10 leading-relaxed">
                        I am currently freelancing and open to new opportunities. If you have an idea or project you’d like to discuss, please reach out!
                    </p>
                </div>
                <div className="grid gap-12 py-16">
                    {SKILLS.map((skillItem) => (
                        <section key={skillItem.id} className="flex flex-col gap-4">
                            <h3 className="text-2xl md:text-3xl font-semibold font-heading uppercase text-paper">{skillItem.heading}</h3>
                            {/* one column on mobile: a square card at a third of a phone's
                                width leaves no room for the copy */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {skillItem.listItems.map((listItem, i) => (
                                    <SkillCard key={`${skillItem.id}-${i}`} icon={listItem.icon} text={listItem.text} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
                {/* no keepStableHeight: Technologies is ~2x the height of Interests, so pinning
                    every panel to the tallest left a large void under the shorter tabs */}
                <Tabs tabs={tabs} ariaLabel="About tabs" keepStableHeight={false} className="mt-16" />
            </div>
        </PageSection >
    )
}

export default About