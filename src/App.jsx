import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useLenis } from './hooks/useLenis'

function App() {
  // Root level: the scroller is the document, and only one instance may own it.
  useLenis()

  return (
    <>
      <Header />

      <main id="main" className="px-8 md:px-12 max-w-7xl mx-auto">
        {/* Home is sticky, and this shared wrapper bounds how long it holds the
            viewport: it releases at the end of About, so the pinned hero isn't
            left painting behind the rest of the page. */}
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
