import { Outlet } from "react-router-dom"
import SidebarPatient from "../../../components/SidebarPatient"

const LayoutPatient = () => {
  return (
        <div>
        <div className="flex gap-15 relative">
            <SidebarPatient/>
            <div className="ml-56 flex-1">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default LayoutPatient