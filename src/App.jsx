import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import VantaDotsBG from "./components/common/VantaBackground"

function App() {
  return (
    <>
      <Header />

      <main id="main" className="px-12 max-w-7xl mx-auto">
        <VantaDotsBG />
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
