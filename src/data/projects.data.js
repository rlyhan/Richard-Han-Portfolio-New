// The Projects page's own copy. Here rather than in the page, so the masthead reads
// its heading and note off the same module as the list underneath it.
//
// The full stop is part of the heading: every display heading on the site is a
// sentence set at size — see the nav's items and the name at the foot of the bar.
export const PROJECTS_HEADING = "Projects.";

export const PROJECTS_NOTE =
  "A selection of work I've done for clients along with a few personal projects.";

const PROJECTS = [
  {
    name: "Neat Places",
    id: "neat-places",
    year: 2021,
    url: "https://neatplaces.co.nz/",
    award: {
      description: "Best Awards 2022 Recipient",
      url: "https://bestawards.co.nz/digital/large-scale-websites/sons-co/neat-places-1/",
    },
    category: "Travel and tourism",
    client: true,
    association: "Sons & Co.",
    description:
      "New Zealand based tourism website consisting of curated guides to cities and places, and a large directory of shops, restaurants, bars, attractions, and more.",
    idea: [
      "Neat Places needed a redesign and rebuild of their website. My team devised a plan to migrate the existing content into a more flexible model, making the site easier to scale while creating a more consistent foundation for the new design system.",
    ],
    work_involved: [
      "The existing site had several distinct content types — from guides and neighbourhood features to stories about local people and businesses. We consolidated these into a unified story model, while retaining backend categorisation so the client could continue managing each type of content according to its purpose.",
      "Built with Django, the model allowed stories to share common content and relationships while still supporting type-specific behaviour. This gave the frontend greater freedom to surface stories based on a user's interests, location or category, rather than being constrained by the way content was categorised in the CMS.",
      "This supported a more fluid design, with stories and places able to appear in different grid-based sections throughout the site and connect naturally to related locations and recommendations.",
      "Alongside the content model, I collaborated with our in-house designer on the responsive implementation of the core UI, including the navigation and content grids.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["neatplaces.webp"],
  },
  {
    name: "Thakeham",
    id: "thakeham",
    year: 2025,
    url: "https://thakeham.com/",
    category: "Residential Housing",
    client: true,
    association: "Make Agency",
    description: "UK based home development.",
    idea: [
      "Thakeham, a UK-based home builder, had a legacy website that needed to be completely rebuilt with a headless CMS, prioritising editor-friendly UX and cost efficiency. My team and I proposed a Next.js build with DatoCMS.",
    ],
    work_involved: [
      "Having worked with DatoCMS on a separate project, I suggested it as the CMS for Thakeham based on its smooth editor experience and suitability for structured housing data. Contentful, Kontent.ai and Sanity were also considered, but DatoCMS offered a simpler editorial experience without the heavily nested structures that can make large datasets difficult to manage.",
      "Its built-in image management was also well suited to an image-driven property experience, with CDN delivery, WebP optimisation, focal-point control and SEO fields, while its pricing comfortably accommodated the dataset we were working with.",
      "From a development perspective, DatoCMS's GraphQL API provided a straightforward way to query the complex housing data, while TypeScript helped keep the resulting business logic structured and navigable as the application grew.",
      "I worked closely with our in-house designer to build sections of the responsive frontend, including carousels within a Tailwind-based design system. I also tested enquiry flows to ensure property-specific data was submitted correctly, and audited SEO across URL structure and metadata.",
    ],
    technologies: ["React", "Next.js", "TypeScript", "GraphQL", "DatoCMS"],
    images: ["thakeham.webp"],
  },
  {
    name: "Touchgrass",
    id: "touchgrass",
    year: 2026,
    url: "https://touchgrass-mobile.vercel.app/",
    category: "Lifestyle",
    client: false,
    association: "Personal",
    description:
      "A mobile app that analyses your Big Five traits and provides personalised activities/hobbies for you. (currently Vercel deployed only, not on app stores)",
    idea: [
      "The idea for the app itself came from the feeling some of us get when we feel like we need a new hobby, but just can't commit the time and effort --- especially if we might not end up enjoying the hobby.",
      "As somebody who is fascinated by popular personality indicators such as Myers-Briggs and how it aligns with our strengths and what we enjoy doing, I decided to deep-dive into research-backed models such as BFAS (Big Five Aspect Scales) and NEO-PI-R (Revised NEO Personality Inventory).",
      "Instead of overwhelming users with random hobbies that they will never do, the app focuses on personalised, identity-aligned suggestions based on who the user is and what they are capable of doing right now.",
      "I always wanted to explore mobile native development, so I took the opportunity to build a React Native app. Presenting the app in a mobile native format was a core philosophy of the app, as I wanted it to be something productive yet fun that people can go to on their phone when they're bored, rather than doomscroll all day.",
    ],
    work_involved: [
      "A significant part of the project was researching and iterating on the recommendation system. I explored how the NEO-PI-R and BFAS personality models could be translated into activity preferences, iterating on how user responses could be scored against different personality patterns before settling on the final recommendation pipeline. The engine was then structured into separate stages for preference scoring, activity filtering and ranking, allowing the logic to be tested and refined independently.",
      "I designed the technical foundation around this flow using a TypeScript monorepo, with shared types and logic between the React Native app and backend. This meant data such as personality traits and user preferences could flow from the onboarding experience through the API and recommendation engine without being redefined at each layer, while keeping the core recommendation logic independent from the mobile interface. I built the backend around Express, with Neon and Drizzle for relational user data, Better Auth for authentication, and Sanity for recommendation content that could be updated without redeploying the application.",
      "The user experience was also used to shape the technical design. I built the onboarding flow early to validate how users would provide their personality, interests and motivations before committing that data to the database, then used the resulting data structure to inform the recommendation engine. I also considered how users would understand and explore recommendations, which led to recommendations being diversified across different interests and activity types rather than simply returning the highest-scoring matches.",
      "I used Claude Code extensively throughout the build, while keeping the architecture and technical decisions under my control. I created detailed context files, documentation and development conventions so the model understood the monorepo structure, shared packages and architectural boundaries before making changes. This allowed me to move quickly through infrastructure and implementation while maintaining a clear understanding of how the different parts of the application fit together.",
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "BetterAuth",
      "Sanity",
    ],
    images: ["touchgrass.webp"],
  },
  {
    name: "Study With New Zealand",
    id: "study-with-nz",
    year: 2022,
    url: "https://www.studywithnewzealand.govt.nz/en",
    category: "Government / Education",
    client: true,
    association: "Voyage",
    description: "Government website for the New Zealand education sector.",
    idea: [
      "Study with New Zealand wanted to give prospective students a personal dashboard where they could save the courses, institutions, scholarships and agents they're interested in, get recommendations, and send enquiries straight to institutions.",
      "The platform is a Next.js and TypeScript monorepo, managed with Lerna, that runs both Study with New Zealand and its sister site NauMai NZ. It combines three data sources: Contentful (page content), Algolia (indexing education data), and separate backend API for student profiles with Auth0 handling login.",
    ],
    work_involved: [
      "We started by working with the backend team to refine the API for profiles and saved items. After that we worked in two-week sprints, building the dashboard's components on a shared Chakra UI design system. Each page template queries Contentful with GraphQL for only the fields it needs, and TypeScript types generated from those queries make the build fail if a content change would break a component. The backend stores only the IDs of saved items, so the dashboard uses Algolia to fetch the full records and to filter, sort and paginate them quickly. Every component came with a Storybook story and Jest unit tests. Cypress end-to-end tests covered key flows like login and access to the dashboard, and all code was peer reviewed.",
      "In terms of UI work, I built the student dashboard from the initial skeleton through to release, from the interface to connecting it with the backend API and Algolia.",
      "I worked closely with the backend team on the API for enquiries. I tested requests beyond the expected cases, such as edge cases in how Tealium tracking IDs were handled by region, and raised what I found with the backend developers so it could be fixed before release. I also added a token check to the API routes that compares the verified Auth0 token with an encrypted profile ID, so users can only access and update their own data, with tests for each endpoint.",
      "For a separate project, to support the build of NauMai NZ, I moved shared UI, content and utility code into separate packages so NauMai NZ could reuse them instead of duplicating code.",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Contentful",
      "GraphQL",
      "Algolia",
    ],
    images: ["studywithnz.webp"],
  },
  {
    name: "G.Network",
    id: "g-network",
    year: 2023,
    url: "https://www.g.network/",
    category: "Broadband",
    client: true,
    association: "Make Agency",
    description: "London based broadband network.",
    idea: [
      "My team and I were onboarded to work on large-scale projects with the central London based broadband provider. Meeting regularly with stakeholders and product teams, and collaborating with backend and CRM teams, my team and I delivered major checkout projects such as One Touch Switch and Pre-Order, along with CMS development and restructures, performance and SEO improvements, and critical production incident resolution.",
    ],
    work_involved: [
      "One Touch Switch: A feature that allows users to switch their broadband provider with a single click, streamlining the process and improving user experience. We met 3 times a week with all teams to align on each other's progress. While backend teams worked with integrating the API from TOTSCo, we were tasked with building a new fork of the checkout journey, rigorously testing different user scenarios according to eligibility based on address and user provided information.",
      "Pre-Order: Following a similar development cycle to One Touch Switch, we built a new checkout journey for users to pre-order their broadband service before it was available in their area. This involved working closely with backend teams around form-submitted information across the site's microservice architecture to the CRM, making sure Pre-Orders were accurately captureds separately to true purchases.",
      "We improved various site metrics, such as initial rendering time through optimisations such as lazy-loading and WebP image formatting.",
      "We also developed various frontend CMS blocks, such a comparison table, comparing various metrics of G.Network to various UK-based broadband providers. Building it in Kontent.ai, where nesting is page-by-page, was challenging, but we managed to cut down entry time by at least 3 hours through identifying the most configurable setup without having to nest heavily.",
    ],
    technologies: ["React", "Next.js", "Kontent.ai"],
    images: ["gnetwork.webp"],
  },
  {
    name: "Gigs of London",
    id: "gigs-of-london",
    year: 2023,
    url: "https://gigs-of-london.vercel.app/",
    category: "Events",
    client: false,
    association: "Personal",
    description:
      "Find events in London on an interactive map. Built with Next.js, Mapbox, and Ticketmaster API.",
    idea: [
      "Inspired by apps like Dice, I wanted a more visually oriented way for people to find live music in their area. As someone that moved to London at the time I didn't know what was going on in my area, and events I looked up online always seemed to be an inconvient distance away.",
    ],
    work_involved: [
      "Using the Ticketmaster Discovery API, I fetched events filtered to be located within London. The API conveniently provided the latitude and longitude for the venue of each event, making it easy to map into markers in Mapbox.",
      "I came up with a simple UI to give users different pathways to find gigs nearer to them - scrollable left panel (top on mobile), which users could hover over to see where exactly the event is. Or, they could simply zoom into their area on the map and hover over markers to unveil the event which they can learn more about if interested.",
      "More recently, I decided to integrate the OpenAI SDK to create AI-generated descriptions of events, since Ticketmaster API didn't really provide much detail on the artists playing. I also created an AI recommendation feature to help people pick out an event based on the vibe they are looking for, rather than blindly browsing through events.",
    ],
    technologies: ["React", "Next.js", "OpenAI SDK", "Mapbox"],
    images: ["gigsoflondon.webp"],
  },
  {
    name: "Deadly Ponies",
    id: "deadly-ponies",
    year: 2021,
    url: "https://deadlyponies.com/",
    category: "Fashion",
    client: true,
    association: "Sons & Co.",
    description: "Australia based handbag and apparel brand.",
    idea: [
      "One of the first high-traffic eCommerce websites I worked on --- I introduced new features, pages, editor flexibility and redesigns.",
    ],
    work_involved: [
      "One-click add to cart and wishlist (Christmas 2021): I made it possible for shoppers to add items to their cart or wishlist straight from the product grid, without opening the product page or reloading. Before building anything, I studied how the product page already handled these actions and reused that code, which sends the request in the background and updates the cart and wishlist in place. I then worked through the edge cases. I adjusted the wishlist's remove endpoint to check where each request came from, returning the updated data to the product grid while keeping the existing redirect for the wishlist page. And because products load dynamically as shoppers scroll, I set up the click-to-add buttons on each product as it loads, not just the ones there initially.",
      "I also built new sections of the site, including Careers (job listings and flexible page layouts) and Product Care (content blocks with video and mobile-only options). I also restructured the navigation menu, making it more mobile friendly and allowing editorial images within it.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["deadlyponies.webp"],
  },
  {
    name: "The Physics Room",
    id: "the-physics-room",
    year: 2020,
    url: "https://physicsroom.org.nz/",
    category: "Art galleries",
    client: true,
    association: "Sons & Co.",
    description: "Christchurch, New Zealand based art gallery.",
    idea: [
      "A website with some unique animations amongst a minimalist design, I worked on some major features such as a rebuild of the navigation menu and a custome e-commerce solution.",
    ],
    work_involved: [
      "The existing navigation menu built in jQuery originally pushed the selected nav item to the left of the screen. I updated it so the menu would open right in the middle of the screen, splitting the page in two. Alongside that I redesigned the homepage layout, cleaned up the page transitions, and built a separate mobile version, working through several rounds of design review with the client.",
      "I added online sales to site by combining two existing pieces: an open-source Django eCommerce library for the cart and checkout, and a reusable Stripe payment module. I joined them by changing the checkout so completed orders go to Stripe, connected shoptools to the site's existing product catalogue, and restyled the cart, checkout and payment pages in the site's templates. I also wrote a jQuery layer that adds items to the cart, updates totals and checks stock without reloading the page, and card details are sent directly to Stripe as a token so they never touch the site's server.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript", "jQuery"],
    images: ["physicsroom.webp"],
  },
  {
    name: "ECC",
    id: "ecc",
    year: 2021,
    url: "https://ecc.co.nz/",
    category: "Furniture",
    client: true,
    association: "Sons & Co.",
    description: "NZ-based furniture retailer.",
    idea: [
      "ECC, a New Zealand furniture and lighting retailer, need a range of updates on their website such as changing how stock was counted to giving featured catalogue page-by-page editor control.",
    ],
    work_involved: [
      "Warehouse stock count logic: I reworked the SAP-imported stock count from a single total into separate figures for the warehouse (which fulfils online orders) and showrooms (enquiry only), creating a single backend source of truth for sellable stock so customers can only order what can actually ship.",
      'I reworked the cart so customers ordering more than is in stock see exactly what happens to their order, for example "3 in stock, 2 with a lead time of 6–8 weeks", instead of a generic error. The rules depend on stock level, lead time and clearance status together, so I moved them into the product model and gave the page clean stock and lead-time data for each variant, which let the cart show the split instantly.',
      "Featured content by page: The site's hero galleries and featured products were tied to catalogue areas, but the client wanted to organise their existing featured content across specific pages, such as the home page or architectural landing page. I restructured the models around pages and wrote a data migration that reassigned all existing content automatically, so editors didn't have to redo anything by hand.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["ecc.webp"],
  },
  {
    name: "Coloursmith",
    id: "coloursmith",
    year: 2020,
    url: "https://coloursmith.com.au/",
    category: "Paints",
    client: true,
    association: "Sons & Co.",
    description: "Australia based paint company.",
    idea: [
      "As a junior, Coloursmith was one of the more challenging sites I worked on, especially building around responsiveness and smooth page transitions.",
    ],
    work_involved: [
      "I worked on a homepage redesign which includes a full-screen video overlay, a carousel of colour stories, a step-by-step process carousel, and a prompt to download the mobile app. The site loads pages without full refreshes, so I made the video overlay attach and detach cleanly as users move between pages. I also built an alternate layout at a separate URL so the client could compare two designs on real devices before committing to one.",
      "Coloursmith lets users upload a photo and click anywhere on it to pick a paint colour, by reading the pixel colour from an HTML canvas. I added pinch and button zoom, which meant rewriting the code that converts a click position into image coordinates, so the correct pixel is still sampled while the image is scaled and panned. I also kept the custom cursor the same visual size at every zoom level. A later update made clicking to pick a colour and dragging to pan feel clearly different, with the cursor changing to show which one you're about to do.",
      "Beyond these, I delivered a steady stream of full-stack features across the Django codebase. These included a journal built from scratch, reusable video overlays and downloadable product manuals, and new pages for products, apps and stories. Throughout, I followed the codebase's existing conventions and made sure new content could be managed by PPG's team through the admin, so they could update the site without needing a developer.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["coloursmith.webp"],
  },
  {
    name: "James Dunlop Textiles",
    id: "james-dunlop-textiles",
    year: 2021,
    url: "https://www.jamesdunloptextiles.com/",
    category: "Textiles",
    client: true,
    association: "Sons & Co.",
    description: "International textiles company.",
    idea: [
      "A website with a massive database and high user traffic, I was given the opportunity to work on various customer experiences while navigating a complex trade catalogue architecture.",
    ],
    work_involved: [
      "Swatch visualiser: a carousel showing each fabric on a finished product, which works much like the site's full furniture visualiser. Each swatch is paired with a product image, and the carousel crossfades between them as it cycles. Clicking a swatch restarts the rotation timer, so it doesn't move on straight after the user makes a choice. I set up the swatch and product pairings as reusable lists in the admin, so the client can create new showcases.",
      "Commercial section localisation: I restructured this section so content could target any combination of regions and markets, not just one region each. As this was a high-traffic live site, I shipped the schema change in stages: I added the new structure alongside the old, migrated the existing content, and only removed the old field once everything had moved over. That way, no visitor ever saw missing content. Now each region and market can be given its own content through the admin, with no code changes.",
      "Alongside this was smaller scale work such as converting a one-off promotional popup into a shared component that remembers dismissals per popup.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["jamesdunlop.webp"],
  },
  {
    name: "West Coast Tas",
    id: "west-coast-tas",
    year: 2020,
    url: "https://westcoasttas.com.au/",
    category: "Tourism",
    client: true,
    association: "Sons & Co.",
    description:
      "The official tourism website for the West Coast of Tasmania, Australia.",
    idea: [
      "As a junior developer I worked on various features, such as an autoplaying video on the homepage and rebuilding the navigation menu according to a new design.",
    ],
    work_involved: [
      "I built a new home page around an ambient background video and an overlay player with a queue of follow-up videos, and shipped it in about a week. As a junior, this was my first real experience with browser video, and iPhones broke most of my desktop assumptions. Safari blocks autoplay unless certain conditions are met, forces videos into its own fullscreen player, and handles exiting that player differently from other browsers, which left my custom controls out of sync. I worked through each case so the two videos never played over each other and the page stayed usable on every device. My first fixes were based on screen size, but I learned to look for the actual cause, fullscreen behaviour, and fix that instead.",
      "The client wanted to manage their site menu without a developer, but the menu was a tightly designed panel that could easily break if editors had free rein. The main challenge was deciding what should be editable and what should stay fixed. I kept the menu's sections and layout in code and made the links inside each section editable in the CMS, so the client can add, remove and reorder them. In Django, I used a single flexible link model that can point at different kinds of content, and a custom admin form so editors pick pages by name rather than dealing with IDs. When the client later needed links to external sites, it was a small addition with no change to the layout, and they now run their own navigation without risk to the design.",
    ],
    technologies: ["Django", "HTML", "CSS", "JavaScript"],
    images: ["westcoasttas.webp"],
  },
  // {
  //   name: "Never Have I Ever",
  //   id: "never-have-i-ever",
  //   year: 2020,
  //   url: "https://neverhaveiever.neatplaces.co.nz/",
  //   category: "Travel and tourism",
  //   client: true,
  //   association: "Sons & Co.",
  //   description:
  //     "Curated New Zealand city guides by creative personalities and business owners. In association with Neat Places.",
  //   idea: [
  //     "One of the first full website builds I worked on, Neat Places wanted a campaign showcasing New Zealand cities through the recommendations of local creatives, business owners and other notable people.",
  //   ],
  //   work_involved: [
  //     "We forked models from the existing Neat Places platform to display curated guides on both homepage and category specific pages, as well as building new ones to reflect unique content such as the navigation menu containing a list of 'never have I ever's.",
  //     "I also built in a full bleed video introducing people to the campaign.",
  //   ],
  //   technologies: ["Django", "HTML", "CSS", "JavaScript"],
  //   images: ["neverhaveiever.webp"],
  // },
  // {
  //   name: "Image Board App",
  //   id: "image-board",
  //   url: "https://image-board-app.vercel.app/",
  //   category: "eCommerce",
  //   client: false,
  //   association: "Personal",
  //   description:
  //     "A simple image board / eCommerce shop. Built with Next.js, MongoDB and Auth0.",
  //   work_involved: [
  //     "Gallery loaded from Pexels API.",
  //     "Authentication with ability to favourite images.",
  //     "eCommerce functionality to buy prints.",
  //   ],
  //   technologies: ["React", "Next.js", "TypeScript", "MongoDB", "Auth0"],
  //   images: ["imageboard.webp"],
  // },
];

export default PROJECTS;
