import RouterProvider from './routes/RouterProvider'
import PageOutlet from './routes/PageOutlet'
import Footer from './components/Footer'
import SiteNav from './components/SiteNav'
import { useLenis } from './hooks/useLenis'

function App() {
  // Root level: the scroller is the document, and only one instance may own it.
  useLenis()

  // The provider is outside the pages as well as around them: the nav bar and the
  // footer outlive every page change, and they ask it where the site is.
  return (
    <RouterProvider>
      {/* No frame here: the gutter and max width belong to each section instead
          (see PageSection), so the hero can run to the viewport edge while About
          still paints its background the full width of the page to cover it.

          What's inside is one page — or, for the length of a handoff, the page
          being left and the page arriving, stacked in one scroll document. */}
      <main id="main">
        <PageOutlet />
      </main>

      {/* Outside the pages, and fixed to the foot of the viewport rather than
          sitting in the flow of any one of them: it answers for the whole site
          below the hero, and it must not be torn down and rebuilt at every join. */}
      <SiteNav />

      <Footer />
    </RouterProvider>
  )
}

export default App
