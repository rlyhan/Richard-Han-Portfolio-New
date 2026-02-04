import PageSection from "./layout/PageSection"

const Home = () => {
    return (
        <PageSection id="home" additionalClasses="flex items-center justify-center min-h-screen">
            <div className="w-full">
                <h1 className="font-heading uppercase mb-6">
                    <span className="text-4xl sm:text-6xl block">Richard Han</span>
                    <span className="text-6xl sm:text-8xl block">Frontend Developer</span>
                </h1>
                <h2 className="text-cyan-400/85 text-2xl sm:text-3xl font-semibold">
                    Currently based in: London, UK
                </h2>
                <h2 className="text-cyan-400/85 text-2xl sm:text-3xl font-semibold">
                    Open to opportunities
                </h2>
                <p className="text-gray-300 text-md sm:text-lg font-medium mt-4">
                    Passionate about turning ideas and designs into excellent, engaging, user-facing products
                </p>
            </div>
        </PageSection>
    )
}

export default Home