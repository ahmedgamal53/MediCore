import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const Layout = () => {
  return (
    <div>
        <div className="flex gap-15 relative">
            <Sidebar/>
            <div className="ml-64 flex-1">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout