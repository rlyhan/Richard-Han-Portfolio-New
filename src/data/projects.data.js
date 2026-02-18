const PROJECTS = [
    {
        "name": "Thakeham",
        "id": "thakeham",
        "url": "https://thakeham.com/",
        "featured": true,
        "category": "Residential Housing",
        "client": true,
        "association": "Make Agency",
        "description": "UK based home development.",
        "work_involved": [
            "Parsed complex API housing data into an optimal logical flow between codebase and DatoCMS",
            "Collaborated closely with designers for bold, user-friendly components such as interactive maps and carousels",
            "Tested and fixed various UX issues across the site",
            "Conducted a full audit and delivered improvements across SEO, accessibility, and analytics"
        ],
        "technologies": [
            "React", "Next.js", "TypeScript", "GraphQL", "DatoCMS"
        ],
        "images": ["thakeham.webp"]
    },
    {
        "name": "Study With New Zealand",
        "id": "study-with-nz",
        "url": "https://www.studywithnewzealand.govt.nz/en",
        "featured": true,
        "category": "Government / Education",
        "client": true,
        "association": "Voyage",
        "description": "Government website for the New Zealand education sector.",
        "work_involved": [
            "Developed a personalised dashboard allowing prospective students to submit details and receive tailored study recommendations",
            "Collaborated with backend engineers on API design, resolving critical user validation issues",
            "Built and structured high-level Contentful CMS to support scalable, editor-friendly content management",
            "Delivered multiple site optimisations to improve rendering performance and querying efficiency",
            "Migrated site to monorepo architecture to support development of NauMai NZ website"
        ],
        "images": ["studywithnz.webp"]
    },
    {
        "name": "Neat Places",
        "id": "neat-places",
        "url": "https://neatplaces.co.nz/",
        "award": {
            "description": "Best Awards 2022 Recipient",
            "url": "https://bestawards.co.nz/digital/large-scale-websites/sons-co/neat-places-1/"
        },
        "featured": true,
        "category": "Travel and tourism",
        "client": true,
        "association": "Sons & Co.",
        "description": "New Zealand based tourism website consisting of curated guides to cities and places, and a large directory of shops, restaurants, bars, attractions, and more.",
        "work_involved": [
            "Delivered a complete front-end restyle, redesigning navigation, articles, and metadata with a more minimalist approach to improve content accessibility and readability.",
            "Reworked the Django-based CMS with simplified content types, reducing information overload for users while preserving flexibility and brand impact for editors.",
            "Collaborated closely on wireframes to ensure optimal performance, responsiveness, and usability across devices."
        ],
        "images": ["neatplaces.webp"]
    },
    {
        "name": "G.Network",
        "id": "g-network",
        "url": "https://www.g.network/",
        "featured": true,
        "category": "Broadband",
        "client": true,
        "association": "Make Agency",
        "description": "London based broadband network.",
        "work_involved": [
            "Built front-end features for large B2C initiatives such as One Touch Switch and Pre-Order, collaborating with multiple teams and stakeholders",
            "Developed new CMS features that enabled A/B testing and more flexible content experimentation",
            "Streamlined CMS workflows for the marketing team, reducing hours of manual data entry",
            "Improved site engagement through performance optimisation, SEO enhancements, and analytics-led audits",
            "Led the investigation and resolution of critical production incidents, improving cross-team communication and response clarity"

        ],
        "technologies": [
            "React", "Next.js", "Kontent.ai"
        ],
        "images": ["gnetwork.webp"]
    },
    {
        "name": "Deadly Ponies",
        "id": "deadly-ponies",
        "url": "https://deadlyponies.com/",
        "featured": true,
        "category": "Fashion",
        "client": true,
        "association": "Sons & Co.",
        "description": "Australia based handbag and apparel brand.",
        "work_involved": [
            "New pages and content blocks",
            "UX improvements across devices",
            "Data optimisation and e-commerce integration"
        ],
        "images": ["deadlyponies.webp"]
    },
    {
        "name": "Gigs of London",
        "id": "gigs-of-london",
        "url": "https://gigs-of-london.vercel.app/",
        "featured": true,
        "category": "Events",
        "client": false,
        "association": "Personal",
        "description": "Find events in London on an interactive map.",
        "work_involved": [
            "Integrated Mapbox and Ticketmaster APIs",
            "Recently integrated OpenAI SDK to suggest events based on mood"
        ],
        "images": ["gigsoflondon.webp"]
    },
    {
        "name": "The Physics Room",
        "id": "the-physics-room",
        "url": "https://physicsroom.org.nz/",
        "featured": true,
        "category": "Art galleries",
        "client": true,
        "association": "Sons & Co.",
        "description": "Christchurch, New Zealand based art gallery.",
        "work_involved": [
            "Animated navigation menu",
            "Set up custom e-commerce system",
            "Fully customised content management system to add various media including articles, videos, audio",
        ],
        "images": ["physicsroom.webp"]
    },
    {
        "name": "Coloursmith",
        "id": "coloursmith",
        "url": "https://coloursmith.com.au/",
        "featured": true,
        "category": "Paints",
        "client": true,
        "association": "Sons & Co.",
        "description": "Australia based paint company.",
        "work_involved": [
            "Intricate frontend work - new pages, content blocks and modern page transitions",
            "Optimised images and backend data querying logic"
        ],
        "images": ["coloursmith.webp"]
    },
    {
        "name": "James Dunlop Textiles",
        "id": "james-dunlop-textiles",
        "url": "https://www.jamesdunloptextiles.com/",
        "featured": true,
        "category": "Textiles",
        "client": true,
        "association": "Sons & Co.",
        "description": "International textiles company.",
        "work_involved": [
            "Multiple front end features including furniture visualiser",
            "CMS models for new pages and content organisation"
        ],
        "images": [
            "jamesdunlop.webp"
        ]
    },
    {
        "name": "ECC",
        "id": "ecc",
        "url": "https://ecc.co.nz/",
        "featured": false,
        "category": "Furniture",
        "client": true,
        "association": "Sons & Co.",
        "description": "New Zealand based furniture company.",
        "work_involved": [
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation"
        ]
    },
    {
        "name": "Never Have I Ever",
        "id": "never-have-i-ever",
        "url": "https://neverhaveiever.neatplaces.co.nz/",
        "featured": false,
        "category": "Travel and tourism",
        "client": true,
        "association": "Sons & Co.",
        "description": "City guides curated by some significant faces. In association with Neat Places.",
        "work_involved": [
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation"
        ]
    },
    {
        "name": "RTA Studio",
        "id": "rta-studio",
        "url": "https://rtastudio.co.nz/",
        "featured": false,
        "category": "Architects",
        "client": true,
        "association": "Sons & Co.",
        "description": "New Zealand based architects.",
        "work_involved": [
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation"
        ]
    }
]

export default PROJECTS