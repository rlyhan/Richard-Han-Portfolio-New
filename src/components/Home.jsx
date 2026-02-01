import PageSection from "./common/PageSection"

const Home = () => {
    return (
        <PageSection id="home">
            <div className="w-full">
                <h1 className="font-heading uppercase mb-6">
                    <span className="text-6xl block">Richard Han</span>
                    <span className="text-8xl block">Frontend Development</span>
                </h1>
                <h2 className="text-gray-400 text-lg">
                    Currently based in London and open for opportunities
                </h2>
                <p className="text-gray-400 text-lg">
                    Passionate about turning ideas and designs into excellent, engaging, user-facing products
                </p>
            </div>
        </PageSection>
    )
}

export default Home