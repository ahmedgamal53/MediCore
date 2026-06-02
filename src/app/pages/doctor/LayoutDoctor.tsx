import { Outlet } from "react-router-dom"
import SidebarDoctor from "../../../components/SidebarDoctor"


const LayoutDoctor = () => {
  return (
    <div>
        <div className="flex gap-15 relative">
            <SidebarDoctor/>
            <div className="ml-50 flex-1">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default LayoutDoctor