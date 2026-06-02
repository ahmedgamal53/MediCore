import { MdMonitorHeart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import { FaClipboardList } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../supabaseClient";

const SidebarDoctor = () => {
  return (
    <div className="bg-[#01050B]/90 w-[200px]  min-h-screen fixed" >
        <div className="flex items-center mt-5 gap-2 px-5 pb-5 border-b-2 border-b-gray-700">
    <div className="bg-[#00C0C1] px-2 py-2 rounded-xl">
                <MdMonitorHeart className="text-2xl" />
    </div>     
     <span className="text-white font-bold text-xl">MediCore</span>
        </div>
        <div className="ml-5 mt-2">
            <h2 className="text-[#696B6E] text-[13px]">ADMINISTRAION</h2>
            <nav className="mt-4 flex flex-col gap-3">
                <ul>
                    <NavLink 
                    to={'/doctor'}
                    className={({isActive})=>
                    `${isActive?'bg-[#00C0C1]/20 text-[#00C0C1]':'text-gray-400'} flex  items-center gap-3 px-3   font-medium py-2 rounded-xl mr-2`

                }
                    >
                        <MdOutlineDashboard className="text-lg"/>
                        <li>Dashboard</li>
                    </NavLink>
                </ul>
                  <ul>
                    <NavLink 
                    to={'/visits'}
                    className={({isActive})=>
                    `${isActive?'bg-[#00C0C1]/20 text-[#00C0C1]':'text-gray-400'} flex  items-center gap-3 px-3   font-medium py-2 rounded-xl mr-2`

                }
                    >
                        <FaClipboardList className="text-lg"/>
                        <li>Patients Visit</li>
                    </NavLink>
                </ul>
                  <ul>
                    <NavLink 
                    to={'/schedule'}
                    className={({isActive})=>
                    `${isActive?'bg-[#00C0C1]/20 text-[#00C0C1]':'text-gray-400'} flex  items-center gap-3 px-3   font-medium py-2 rounded-xl mr-2`

                }
                    >
                        <LuClock3 className="text-lg"/>
                        <li>Schedule</li>
                    </NavLink>
                </ul>
               
                <button 
                onClick={()=>supabase.auth.signOut()}
                className="flex cursor-pointer items-center gap-3 px-3   font-medium py-2 rounded-xl mr-2 text-gray-400"
                >
                    <FiLogOut className="text-lg"/>
                    <p>log out</p>
                </button>
            </nav>
        </div>
    </div>
  )
}

export default SidebarDoctor