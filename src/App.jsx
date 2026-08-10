import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />

      <main id="main" className="px-8 md:px-12 max-w-7xl mx-auto">
        {/* Home and About share a containing block on purpose: Home is sticky,
            and this wrapper is what bounds how long it holds the viewport. It
            releases at the end of About — long after About has covered it — so
            the pinned hero is not left painting behind the rest of the page. */}
        <div className="relative">
          <Home />
          <About />
        </div>
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
