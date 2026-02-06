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
            render: () => (
                <>
                    {WORK.map((workItem) => (
                        <Article key={workItem.id}
                            item={workItem}
                            backgroundColor="bg-black"
                            containerStyles="p-8 rounded-lg border border-solid border-yellow-400/50 hover:bg-gray-800 transition"
                            textStyles="text-sm sm:text-md md:text-lg"
                            icon="default" />
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
                            containerStyles="p-6 rounded-lg border border-solid border-gray-700 hover:bg-gray-800 transition"
                            textStyles="text-sm sm:text-md md:text-lg" />
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
                <div className="flex flex-col gap-4">
                    {INTERESTS.map((interest) => (
                        <IconCard key={interest.id} icon={interest.icon} text={interest.text} />
                    ))}
                </div>
            ),
        }
    ];

    return (
        <PageSection id="about">
            <SectionHeading label="About" />
            <div className="max-w-5xl mr-auto">
                <p className="text-grey-500 text-xl sm:text-2xl lg:text-3xl mb-10">
                    Hi! I'm Richard, and I have been building web apps for a range of clients since 2020.
                </p>
                <p className="text-grey-500 text-xl sm:text-2xl lg:text-3xl mb-10">
                    I am a front-end developer commonly working with React/NextJS apps alongside TypeScript, Tailwind, and various headless CMS.
                    I have expertise working across the full stack, including backend development with Python/Django and PHP/WordPress.
                </p>
                <p className="text-grey-500 text-xl sm:text-2xl lg:text-3xl mb-10">
                    I love creating performant, accessible, and user-friendly web experiences that help businesses grow online.
                </p>
            </div>
            <Tabs tabs={tabs} ariaLabel="About tabs" keepStableHeight className="mt-16" />
        </PageSection>
    )
}

export default About