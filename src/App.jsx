import { Outlet, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import MobileNavigation from "./components/MobileNavigation"
import { useEffect } from "react"
import { debounce } from "lodash"
import { SCROLL } from "./config/constants"

function App() {
  const location = useLocation();

  useEffect(() => {
    const scrollY = Number(window.sessionStorage.getItem(SCROLL + location.pathname.replaceAll("/", "_"))) || 0;
    window.scrollTo({ top: scrollY, behavior: "auto" });

    const handleScroll = debounce(() => {
      window.sessionStorage.setItem(SCROLL + location.pathname.replaceAll("/", "_"), window.scrollY);
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [location.pathname]);

  return (
    <div className="pb-14 sm:px-0 lg:pb-0">
      <Header />
      <main className="min-h-screen w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  )
}

export default App
