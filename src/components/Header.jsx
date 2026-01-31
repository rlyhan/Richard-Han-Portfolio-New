const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/60">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <span className="text-lg font-semibold">Your Name</span>
                <ul className="flex gap-6 text-sm">
                    <li><a href="#home" className="hover:text-gray-400">Home</a></li>
                    <li><a href="#about" className="hover:text-gray-400">About</a></li>
                    <li><a href="#projects" className="hover:text-gray-400">Projects</a></li>
                    <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header