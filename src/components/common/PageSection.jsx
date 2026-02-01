const PageSection = ({ id, children }) => {
    return (
        <section
            id={id}
            className="w-full min-h-screen flex items-center justify-center"
        >
            {children}
        </section>
    )
}

export default PageSection
