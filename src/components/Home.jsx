import PageSection from "./layout/PageSection"

const Home = () => {
    return (
        <PageSection id="home" additionalClasses="flex items-center justify-center min-h-screen">
            <div className="w-full self-end">
                <div className="flex items-end justify-between">
                    <h1 className="font-heading uppercase mb-10 line-height">
                        <span className="block text-neutral-100 text-6xl sm:text-7xl mr-2">Richard Han</span>
                        <span className="block text-neutral-700 text-xl sm:text-3xl">Front End | Full Stack Developer</span>
                    </h1>
                    <p className="text-neutral-100/85 text-sm sm:text-lg font-medium mb-10">
                        Open to opportunities | Currently based in: <span className="text-neutral-900/85">Auckland, NZ</span>
                    </p>
                </div>
            </div>

        </PageSection>
    )
}

export default Home