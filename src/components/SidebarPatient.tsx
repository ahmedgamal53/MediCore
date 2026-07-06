import { MdMonitorHeart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../supabaseClient";
import { FaStethoscope } from "react-icons/fa";
import { FileHeart } from "lucide-react";

const SidebarPatient = () => {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-tr-2xl rounded-br-2xl w-[200px] min-h-screen fixed" >
        <div className="flex items-center mt-5 gap-2 px-5 pb-5 border-b border-white/30">
    <div className="bg-[#00C0C1] px-2 py-2 rounded-xl">
                <MdMonitorHeart className="text-2xl text-gray-900" />
    </div>     
 <h1 className="text-[2rem] font-extrabold tracking-tight">
      <span className="text-slate-900">Medi</span>
      <span className="text-[#00C0C1] ">Core</span>
    </h1>        </div>
        <div className="ml-5 mt-2">
            <h2 className="text-gray-600 text-sm font-medium">ADMINISTRAION</h2>
            <nav className="mt-4 mr-2 flex flex-col gap-3">
                <ul>
                    <NavLink 
                    to={'/home'}
                    className={({isActive})=>
                    `${isActive
    ? "bg-white  text-[#00C0C1] shadow-lg ring-1 ring-gray-100 scale-[1.02]"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"} flex items-center gap-3 px-3 py-2 rounded-xl transition-colors`

                }
                    >
                        <MdOutlineDashboard className="text-2xl "/>
                        <li>Home</li>
                    </NavLink>
                </ul>
                  <ul>
                    <NavLink 
                    to={'/doctorsPatient'}
                    className={({isActive})=>
                    `${isActive
    ? "bg-white text-[#00C0C1] shadow-lg ring-1 ring-gray-100 scale-[1.02]"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}} flex items-center gap-3 px-3 py-2 rounded-xl transition-colors`

                }
                    >
                        <FaStethoscope className="text-2xl "/>
                        <li>Doctor</li>
                    </NavLink>
                </ul>
                  <ul>
                    <NavLink 
                    to={'/schedule'}
                    className={({isActive})=>
                    `${isActive
    ? "bg-white text-[#00C0C1] shadow-lg ring-1 ring-gray-100 scale-[1.02]"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}} flex items-center gap-3 px-3 py-2 rounded-xl transition-colors`

                }
                    >
                        <LuClock3 className="text-2xl "/>
                        <li>Schedule</li>
                    </NavLink>
                </ul>
                  <ul>
                    <NavLink 
                    to={'/medical'}
                    className={({isActive})=>
                    `${isActive
    ? "bg-white text-[#00C0C1] shadow-lg ring-1 ring-gray-100 scale-[1.02]"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}} flex items-center gap-3 px-3 py-2 rounded-xl transition-colors`

                }
                    >
                        <FileHeart  className="text-2xl "/>
                        <li>Medical History</li>
                    </NavLink>
                </ul>
               
               <button
        onClick={() => supabase.auth.signOut()}
        className="flex items-center gap-4 px-4 py-3  rounded-2xl text-slate-500 font-medium transition-all duration-300 hover:bg-red-50 hover:text-red-500"
      >
        <FiLogOut className="text-2xl" />
        <span>Log Out</span>
      </button>

            </nav>
        </div>
    </div>
  )
}

export default SidebarPatient