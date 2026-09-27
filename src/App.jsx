import Home from './components/Home'
import AboutPage from './components/about/AboutPage'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useLenis } from './hooks/useLenis'

function App() {
  // Root level: the scroller is the document, and only one instance may own it.
  useLenis()

  return (
    <>
      {/* No frame here: the gutter and max width belong to each section instead
          (see PageSection), so the hero can run to the viewport edge while About
          still paints its background the full width of the page to cover it. */}
      <main id="main">
        {/* Home is sticky, and this shared wrapper bounds how long it holds the
            viewport: it releases at the end of About, so the pinned hero isn't
            left painting behind the rest of the page. */}
        <div className="relative">
          <Home />
          <AboutPage />
        </div>
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
