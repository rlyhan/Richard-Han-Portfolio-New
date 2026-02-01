import PageSection from "./common/PageSection"
import Article from "./common/Article"
import Tabs from "./common/Tabs/Tabs"
import { WORK, TECH, SKILLS } from "../data/work.data"

const About = () => {
    const tabs = [
        {
            id: "experience",
            tabName: "Experience",
            render: () => (
                <>
                    {WORK.map((workItem) => (
                        <Article key={workItem.id} item={workItem} />
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
                        <Article key={techItem.id} item={techItem} />
                    ))}
                </>
            ),
        },
        {
            id: "skills",
            tabName: "Skills",
            useGrid: true,
            render: () => (
                <>
                    {SKILLS.map((skillItem) => (
                        <Article key={skillItem.id} item={skillItem} />
                    ))}
                </>
            ),
        },
    ];

    return (
        <PageSection id="about">
            <div className="">
                <h2 className="text-3xl font-semibold mb-4">About</h2>
                <p className="text-gray-400 leading-relaxed mb-10">
                    Hi! I'm Richard, and I have been building high-traffic web apps for a range of clients since 2020.
                    I work commonly with React/NextJS apps, alongside TypeScript, Tailwind, and various headless CMS like Contentful.

                </p>
                <Tabs tabs={tabs} keepStableHeight />
            </div>
        </PageSection>
    )
}

export default About