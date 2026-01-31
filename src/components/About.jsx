import PageSection from "./common/PageSection"

const About = () => {
    return (
        <PageSection id="about">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">About</h2>
                <p className="text-gray-400 leading-relaxed">
                    A short paragraph about you, your background, and what you care
                    about when building things.
                </p>
            </div>
        </PageSection>
    )
}

export default About