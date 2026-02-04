import PageSection from "./layout/PageSection"
import Article from "./common/Article"
import Tabs from "./common/Tabs/Tabs"
import SectionHeading from "./common/SectionHeading"
import { WORK, TECH, SKILLS } from "../data/work.data"

const About = () => {
    const tabs = [
        {
            id: "experience",
            tabName: "Experience",
            render: () => (
                <>
                    {WORK.map((workItem) => (
                        <Article key={workItem.id} item={workItem} containerStyles="p-8 rounded-lg" textStyles="text-lg" icon="default" />
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
                        <Article key={techItem.id} item={techItem} icon={techItem.icon} includeHeaderIcon useListIcons={false} />
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
                        <Article key={skillItem.id}
                            item={skillItem}
                            icon={skillItem.icon}
                            backgroundColor="bg-black"
                            containerStyles="p-6 border border-solid border-yellow-300/50 rounded-lg"
                            textStyles="text-lg mb-4" />
                    ))}
                </>
            ),
        },
    ];

    return (
        <PageSection id="about">
            <SectionHeading label="About" />
            <p className="text-grey-500 text-4xl mb-10">
                Hi! I'm Richard, and I have been building high-traffic web apps for a range of clients since 2020.
            </p>
            <p className="text-grey-500 text-4xl mb-10">
                I am a front-end developer commonly working with React/NextJS apps alongside TypeScript, Tailwind, and various headless CMS.
                <br />I have expertise working across the full stack, including backend development with Python/Django and PHP/WordPress.
            </p>
            <p className="text-grey-500 text-4xl mb-10">
                I love creating performant, accessible, and user-friendly web experiences that help businesses grow online.
            </p>
            <Tabs tabs={tabs} keepStableHeight className="mt-16" />
        </PageSection>
    )
}

export default About