const PageSection = ({ id, children }) => {
    return (
        <section
            id={id}
            className="w-full min-h-screen flex items-center justify-center px-6 bg-black/90"
        >
            {children}
        </section>
    )
}

export default PageSection
