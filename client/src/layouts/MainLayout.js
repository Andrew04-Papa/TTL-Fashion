import { Outlet } from "react-router-dom"
import Header from "../components/common/Header.js"
import Footer from "../components/common/Footer.js"

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
