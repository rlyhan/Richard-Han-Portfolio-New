import List from "./List"

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

            <List listItems={listItems} keyPrefix={`${id}-articleitem`} />
        </article>
    )
}

export default Article