import PageSection from "./layout/PageSection"

const Home = () => {
    return (
        <PageSection id="home" additionalClasses="flex items-center justify-center min-h-screen">
            <div className="w-full">
                <h1 className="font-heading uppercase mb-4 text-white/85">
                    <span className="text-4xl sm:text-6xl block">Richard Han</span>
                    <span className="text-6xl sm:text-8xl block">Frontend Developer</span>
                </h1>

                <p className="text-yellow-200/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] text-sm sm:text-lg font-medium mb-4">
                    Turning ideas and designs into engaging user experiences
                </p>

                <p className="text-white/85 text-lg sm:text-3xl font-semibold">
                    Currently based in: London, UK
                </p>

                <p className="text-white/85 text-lg sm:text-3xl font-semibold">
                    Open to opportunities
                </p>
            </div>

        </PageSection>
    )
}

export default Home