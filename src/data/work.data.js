const WORK = [
    {
        id: "makeagency",
        heading: "Make Agency",
        subheading: "2023 - 2025 · Website Developer",
        listItems: [
            "Led in-house dev team on React-based projects.",
            "Built One-Touch-Switch and Pre-Order functionality for London broadband company G.Network.",
            "Developed and maintained various client projects using WordPress-based stack.",
            "Introduced new documentation and error-reporting integrations to improve team knowledge and workflows."
        ]
    },
    {
        id: "voyage",
        heading: "Voyage",
        subheading: "2022 - 2023 · Front End Developer",
        listItems: [
            "Built study recommendation dashboard on Study With New Zealand website, collaborating with API dev team.",
            "Migrated legacy architecture into mono-repo.",
            "Mentored junior developers."
        ]
    },
    {
        id: "sonsandco",
        heading: "Sons & Co",
        subheading: "2020 - 2022 · Full Stack Web Developer",
        listItems: [
            "End-to-end rebuild of Neat Places website which earned a Best Award.",
            "Delivered modern, responsive frontend interfaces with strong design and UX focus.",
            "Backend work including eCommerce functionality, data integration logic, and query optimisation."
        ]
    }
]

const TECH = [
    {
        id: "languages",
        heading: "Languages",
        listItems: [
            "JavaScript ES6", "jQuery", "TypeScript", "HTML5", "CSS", "SASS", "Python", "PHP"
        ],
        icon: "code"
    },
    {
        id: "frameworks-libraries",
        heading: "Frameworks & Libraries",
        listItems: [
            "React", "NextJS", "Node.js", "React Native", "Redux", "Django", "Tailwind", "Cypress", "Storybook", "React Testing Library"
        ],
        icon: "book"
    },
    {
        id: "cms",
        heading: "CMS",
        listItems: [
            "Contentful", "Kontent.ai", "DatoCMS", "Sanity", "Strapi", "WordPress"
        ],
        icon: "file"
    },
    {
        id: "database",
        heading: "Databases & APIs",
        listItems: [
            "REST API", "GraphQL", "MongoDB", "PostgreSQL"
        ],
        icon: "server"
    },
    {
        id: "seo-analytics",
        heading: "SEO & Analytics",
        listItems: [
            "Google Analytics", "Screaming Frog"
        ],
        icon: "search"
    },
    {
        id: "devops",
        heading: "DevOps, CI/CD, Tools",
        listItems: [
            "GitHub Actions", "Docker", "Sentry"
        ],
        icon: "tool"
    },
    {
        id: "cloud-infrastructure",
        heading: "Cloud & Infrastructure",
        listItems: [
            "Azure", "AWS", "Cloudflare", "Digital Ocean", "Vercel",
        ],
        icon: "cloud"
    },
    {
        id: "design",
        heading: "Design",
        listItems: [
            "Figma", "Photoshop"
        ],
        icon: "pen"
    },
    {
        id: "ai",
        heading: "AI",
        listItems: [
            "Claude Code",
            "GitHub Copilot",
            "OpenAI SDK"
        ],
        icon: "robot"
    }
]

// Each list item carries its own icon: the skills render as one card per item, so
// a single group-level icon would repeat across every card in the row.
const SKILLS = [
    {
        id: "solution-skill",
        heading: "Solutions",
        listItems: [
            { text: "Building frontends pixel-perfect to design that brings your brand to life for users", icon: "pen" },
            { text: "Integrating editor-friendly headless CMS and eCommerce platforms and complex domain data", icon: "cloud" },
            { text: "Measuring customer engagement through SEO, accessibility, and analytics", icon: "search" },
        ]
    },
    {
        id: "collaboration-skill",
        heading: "Collaboration",
        listItems: [
            { text: "Clearly guiding clients through business impact and technical feasibility", icon: "users" },
            { text: "Effective cross-team communication with designers, developers and product teams", icon: "activity" },
            { text: "Supports team development through mentorship and knowledge sharing", icon: "file" },
        ]
    },
    {
        id: "workflow-skill",
        heading: "Workflow",
        listItems: [
            { text: "AI-assisted development that accelerates delivery", icon: "robot" },
            { text: "High standard code maintainability and safe deployment practices", icon: "code" },
            { text: "Implementing effective short-term solutions as well as long-term scalable implementations", icon: "tool" },
        ]
    },
]

const INTERESTS = [
    {
        id: "music-interest",
        icon: "acoustic-guitar.png",
        text: "Music is my #1 passion outside of dev, I love singing, guitar, and songwriting along with going to live shows. My favourite genres are indie rock, punk, metal, and folk.",
    },
    {
        id: "cinema-interest",
        icon: "movie.png",
        text: "I love the cinema. My favourites of 2025: Marty Supreme, Demon Slayer: Infinity Castle, The Long Walk, 28 Years Later, Sinners",
    },
    {
        id: "other-interests",
        icon: "ski.png",
        text: "Skiing, cooking, and practicing my Japanese are other things I like to do with my time.",
    }
]

export { WORK, TECH, SKILLS, INTERESTS }