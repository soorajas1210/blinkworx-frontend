import { Outlet } from "react-router-dom"
import Navbar from "../global/Navbar"


const Layout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="p-5">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
