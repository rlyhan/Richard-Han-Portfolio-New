import PageSection from "./layout/PageSection"
import Article from "./common/Article"
import Tabs from "./common/Tabs/Tabs"
import SectionHeading from "./common/SectionHeading"
import { WORK, TECH, SKILLS, INTERESTS } from "../data/work.data"
import IconCard from "./common/Cards/IconCard"

const About = () => {
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
                            textStyles="text-gray-950 text-sm font-medium"
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
                <div className="grid md:grid-cols-3 gap-4">
                    {INTERESTS.map((interest) => (
                        <IconCard key={interest.id} icon={interest.icon} text={interest.text} />
                    ))}
                </div>
            ),
        }
    ];

    return (
        <PageSection id="about" additionalClasses="max-w-4xl mx-auto">
            <SectionHeading label="About" />
            <div>
                <p className="text-gray-900 text-xl md:text-2xl mb-10">
                    Hi! I'm Richard, and I have been building web applications for a range of clients since 2020.
                </p>
                <p className="text-gray-900 text-xl md:text-2xl mb-10">
                    I carry a passion for creating visually-driven digital experiences, architecting solutions that
                    scale and perform, and collaborating closely with different kinds of people to bring ambitious concepts to life.
                </p>
                <p className="text-gray-900 text-xl md:text-2xl mb-10">
                    I have a strong background in React and Next.js frontend development, with experience across Node.js and Django based architectures.
                    I’ve also worked extensively with headless CMS, eCommerce systems, and third-party APIs to deliver complete, production-ready features.
                </p>

                <p className="text-gray-900 text-xl md:text-2xl mb-10">
                    More recently, I’ve been exploring AI-assisted workflows, architecting context-aware solutions and utilising agentic and custom command-driven tooling to automate, accelerate and stabilise processes.
                </p>
            </div>
            <div className="grid gap-12 py-16">
                {SKILLS.map((skillItem) => (
                    <Article key={skillItem.id} item={skillItem} icon={skillItem.icon} />
                ))}
            </div>
            {/* no keepStableHeight: Technologies is ~2x the height of Interests, so pinning
                every panel to the tallest left a large void under the shorter tabs */}
            <Tabs tabs={tabs} ariaLabel="About tabs" keepStableHeight={false} className="mt-16" />
        </PageSection >
    )
}

export default About