const PROJECTS = [
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
            "Built study recommendation dashboard for prospective students.",
            "Migrated legacy architecture to monorepo.",
            "Identified critical API issues and refined API design with backend team.",
            "High-level, structured Contentful integration to support complex data while retaining editor usability.",
            "Improved performance through optimising querying and search indexing."
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
            "Redesigned frontend to improve navigation, readability, and content accessibility.",
            "Refactored entire CMS, reducing complexity while maintaining flexibility.",
            "Helped deliver responsive, performance optimised UI through collaboration on wireframes and implementation."
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
            "Delivered major B2C features (One Touch Switch, Pre-Order) with cross-functional teams.",
            "CMS development and restructures, enabling editors greater content flexiblity, A/B testing and reduction of manual overhead by hours.",
            "Fully audited and improved performance and SEO metrics.",
            "Led investigation and resolution of critical production incidents."
        ],
        "technologies": [
            "React", "Next.js", "Kontent.ai"
        ],
        "images": ["gnetwork.webp"]
    },
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
            "Developed interactive UI elements including maps and carousels.",
            "Identified and fixed UX issues across the site.",
            "Refined and tested complex API data flows and DatoCMS integration.",
            "Identified and resolved SEO, accessibility, and analytics issues."
        ],
        "technologies": [
            "React", "Next.js", "TypeScript", "GraphQL", "DatoCMS"
        ],
        "images": ["thakeham.webp"]
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
            "New pages and content blocks.",
            "UX improvements across devices.",
            "Data optimisation and e-commerce integration."
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
            "Ticketmaster API integration to fetch real-time event data.",
            "Mapbox integration for interactive event mapping.",
            "OpenAI SDK integration to suggest events based on mood and generate descriptions."
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
            "Animated navigation menu.",
            "Set up custom e-commerce system.",
            "Fully customised content management system to add various media including articles, videos, audio.",
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
            "Intricate frontend work - new pages, content blocks and modern page transitions.",
            "Optimised images and backend data querying logic."
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
            "Multiple front end features including furniture visualiser.",
            "CMS models for new pages and content organisation."
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
            "Front end functionality and styling.",
            "Back end development including highly customisable content management system, data optimisation."
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
            "Front end functionality and styling.",
            "Back end development including highly customisable content management system, data optimisation."
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
            "Front end functionality and styling.",
            "Back end development including highly customisable content management system, data optimisation."
        ]
    }
]

export default PROJECTS