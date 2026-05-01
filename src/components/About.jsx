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
            useGrid: true,
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
                            textStyles="text-white/80 text-xs sm:text-sm font-medium"
                            icon={techItem.icon}
                            includeHeaderIcon
                            useListIcons={false}
                        />
                    ))}
                </>
            ),
        },
        {
            id: "Interests",
            tabName: "Interests",
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
            <div className="max-w-5xl mr-auto">
                <p className="text-grey-500 text-xl md:text-2xl lg:text-3xl mb-10">
                    Hi! I'm Richard, and I have been building web applications for a range of clients since 2020.
                </p>
                <p className="text-grey-500 text-xl md:text-2xl lg:text-3xl mb-10">
                    I carry a passion for creating visually-driven digital experiences, architecting solutions that
                    scale and perform, and collaborating closely with different kinds of people to bring ambitious concepts to life.
                </p>
                <p className="text-grey-500 text-xl md:text-2xl lg:text-3xl mb-10">
                    I have a strong background in React and Next.js frontend development, with experience across Node.js and Django based architectures.
                    I’ve also worked extensively with headless CMS, eCommerce systems, and third-party APIs to deliver complete, production-ready features.
                </p>

                <p className="text-grey-500 text-xl md:text-2xl lg:text-3xl mb-10">
                    More recently, I’ve been exploring AI-assisted workflows, architecting context-aware solutions and utilising agentic and custom command-driven tooling to automate, accelerate and stabilise processes.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 block py-16">
                {SKILLS.map((skillItem) => (
                    <Article key={skillItem.id} item={skillItem} icon={skillItem.icon} />
                ))}
            </div>
            <Tabs tabs={tabs} ariaLabel="About tabs" keepStableHeight className="mt-16" />
        </PageSection >
    )
}

export default About