const Article = ({ item }) => {
    const { id, heading, listItems } = item
    return (
        <article key={id} className="grid gap-4 mb-4">
            <header>
                <h3 className="text-xl font-semibold">{heading}</h3>
                {item.subheading ? <p className="text-sm text-gray-400">
                    {item.subheading}
                </p> : <></>}
            </header>

            <ul className="list-disc list-inside text-gray-300 space-y-2">
                {listItems.length && listItems.map((listItem, i) => (
                    <li key={i}>{listItem}</li>
                ))}
            </ul>
        </article>
    )
}

export default Article