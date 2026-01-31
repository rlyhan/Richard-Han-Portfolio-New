import PageSection from "./common/PageSection"

const Contact = () => {
    return (
        <PageSection id="contact">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-semibold mb-4">Contact</h2>
                <p className="text-gray-400 mb-6">
                    Want to work together or just say hi?
                </p>
                <a
                    href="mailto:you@example.com"
                    className="inline-block border border-white px-6 py-3 rounded hover:bg-white hover:text-black transition"
                >
                    Get in touch
                </a>
            </div>
        </PageSection>
    )
}

export default Contact