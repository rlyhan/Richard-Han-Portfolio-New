import PageSection from "./layout/PageSection"

const Home = () => {
    return (
        <PageSection id="home" additionalClasses="flex items-center justify-center">
            <div className="w-full">
                <h1 className="font-heading uppercase mb-6">
                    <span className="text-6xl block">Richard Han</span>
                    <span className="text-8xl block">Frontend Developer</span>
                </h1>
                <h2 className="text-sky-500/95 text-lg font-medium">
                    Currently based in London and open for opportunities
                </h2>
                <p className="text-gray-300 text-lg font-medium">
                    Passionate about turning ideas and designs into excellent, engaging, user-facing products
                </p>
            </div>
        </PageSection>
    )
}

export default Home