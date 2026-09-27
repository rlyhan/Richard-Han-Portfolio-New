import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import Footer from './components/Footer'
import SiteNav from './components/SiteNav'
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
          <HomePage />
          <AboutPage />
        </div>
        <ProjectsPage />
        <ContactPage />
      </main>

      {/* Outside main, and fixed to the foot of the viewport rather than sitting
          in the flow of any one section: it answers for the whole page below the
          hero. */}
      <SiteNav />

      <Footer />
    </>
  )
}

export default App
