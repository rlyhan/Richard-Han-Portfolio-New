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
                        <Article key={workItem.id}
                            item={workItem}
                            containerStyles="p-8 rounded-lg border border-solid border-gray-700 hover:bg-gray-800 transition"
                            textStyles="text-sm"
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
                            containerStyles="p-6 rounded-lg border border-solid border-gray-700 hover:bg-gray-800 transition"
                        />
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
                    My primary focus is front end development with React/NextJS apps alongside TypeScript, Tailwind, and various headless CMS.
                    I have expertise working across the full stack, including backend development with Python/Django and PHP/WordPress.
                </p>
                <p className="text-grey-500 text-xl md:text-2xl lg:text-3xl mb-10">
                    I’m passionate about developing visually driven sites where design and interaction really matter, and about turning ambitious ideas into engaging user experiences through close collaboration, while ensuring scalability, performance, and measurable business impact.                </p>
            </div>
            <Tabs tabs={tabs} ariaLabel="About tabs" keepStableHeight className="mt-16" />
        </PageSection >
    )
}

export default About