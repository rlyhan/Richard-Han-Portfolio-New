import RouterProvider from './routes/RouterProvider'
import PageOutlet from './routes/PageOutlet'
import Footer from './components/Footer'
import SiteNav from './components/SiteNav'
import { useLenis } from './hooks/useLenis'

// The document is one screen tall before the footer is reached, whatever the outlet
// is holding. A page's chunk is fetched after the entry chunk that asks for it, so
// on a cold load there are frames where no page is mounted and the outlet has no
// height — and the footer, which is the next thing in the document, paints at the
// top of the viewport and is then pushed a screen down when the page arrives.
//
// lvh rather than the hero's own svh: svh is the viewport with the browser's chrome
// showing, so on a phone with the toolbars hidden it would leave the footer peeking
// at the bottom of that first screen. It only ever binds before the first page is
// mounted — every page in the site is taller than a screen once it is.
const MAIN_MIN_HEIGHT = 'min-h-lvh'

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
      <main id="main" className={MAIN_MIN_HEIGHT}>
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
