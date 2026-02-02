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
            "New build of their site using a new CMS",
            ""
        ],
        "technologies": [
            "React", "Next.js", "TypeScript", "GraphQL", "DatoCMS"
        ],
        "images": ["thakeham.webp"]
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
            "Successfully developed large scale projects for customer checkout: One Touch Switch and pre-order system",
            "Built engaging new content blocks and improving CMS setup to cut down data entry time",
            "Improved engagement through audits of SEO, analytics and accessibility",
            "Investigated and solved major outages"
        ],
        "technologies": [
            "React", "Next.js", "Kontent.ai"
        ],
        "images": ["gnetwork.webp"]
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
            "Developed dashboard allowing prospective students to fill their details and fetch personalises study recommendations.",
            "Building large scale component library",
            "Collaborating on API development with backend engineers",
            "Contentful CMS development",
        ],
        "images": ["studywithnz.webp"]
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
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation, e-commerce integration"
        ],
        "images": ["deadlyponies.webp"]
    },
    {
        "name": "Neat Places",
        "id": "neat-places",
        "url": "https://neatplaces.co.nz/",
        "best_awards_url": "https://bestawards.co.nz/digital/large-scale-websites/sons-co/neat-places-1/",
        "featured": true,
        "category": "Travel and tourism",
        "client": true,
        "association": "Sons & Co.",
        "description": "New Zealand based tourism website consisting of curated guides to cities and places, and a large directory of shops, restaurants, bars, attractions, and more.",
        "work_involved": [
            "Front end functionality and styling",
            "Integrating APIs such as Instagram",
            "Back end development including highly customisable content management system, data optimisation"
        ],
        "images": ["neatplaces.webp"]
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
            "Front end functionality and styling",
            "Fully customisable content management system to add various media including articles, videos, audio",
            "Full e-commerce integration"
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
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation"
        ],
        "images": ["coloursmith.webp"]
    },
    {
        "name": "Gigs of London",
        "id": "gigs-of-london",
        "url": "https://gigs-of-london.vercel.app/",
        "featured": true,
        "category": "Events",
        "client": false,
        "association": "Personal",
        "description": "Find events in London on a map",
        "work_involved": [],
        "images": ["gigsoflondon.webp"]
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
        "name": "James Dunlop Textiles",
        "id": "james-dunlop-textiles",
        "url": "https://www.jamesdunloptextiles.com/",
        "featured": true,
        "category": "Textiles",
        "client": true,
        "association": "Sons & Co.",
        "description": "International textiles company.",
        "work_involved": [
            "Front end functionality and styling",
            "Back end development including highly customisable content management system, data optimisation"
        ],
        "images": [
            "jamesdunlop.webp"
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