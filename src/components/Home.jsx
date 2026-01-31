import PageSection from "./common/PageSection"

const Home = () => {
    return (
        <PageSection id="home">
            <div className="max-w-3xl text-center">
                <h1 className="text-5xl font-bold mb-6">Hi, I’m Richard</h1>
                <p className="text-gray-400 text-lg">
                    Frontend developer crafting clean, expressive interfaces.
                </p>
            </div>
        </PageSection>
    )
}

export default Home