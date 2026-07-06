import { MdMonitorHeart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import { FaClipboardList, FaHospitalUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../supabaseClient";

const SidebarDoctor = () => {
  return (
   

     <div className="fixed left-0 top-0 w-64 min-h-screen bg-white border-r border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,.05)]">

  {/* Logo */}
  <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-200">

    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-200/60">
      <MdMonitorHeart className="text-2xl text-white" />
    </div>

    <h1 className="text-[2rem] font-extrabold tracking-tight">
      <span className="text-slate-900">Medi</span>
      <span className="text-cyan-500">Core</span>
    </h1>

  </div>

  {/* Menu */}
  <div className="px-4 pt-8">

    <h2 className="px-2 text-sm font-bold tracking-wider uppercase text-slate-500">
      Administration
    </h2>

    <nav className="mt-6 flex flex-col gap-3">

      {/* Dashboard */}
      <NavLink
        to="/doctor"
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-white text-cyan-500 shadow-lg border border-slate-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <MdOutlineDashboard className="text-2xl" />
        <span>Dashboard</span>
      </NavLink>

      {/* Visits */}
      <NavLink
        to="/Patient"
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-white text-cyan-500 shadow-lg border border-slate-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <FaHospitalUser className="text-2xl" />
        <span>Patients </span>
      </NavLink>
      <NavLink
        to="/visits"
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-white text-cyan-500 shadow-lg border border-slate-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <FaClipboardList className="text-2xl" />
        <span>Patients Visit</span>
      </NavLink>

      {/* Schedule */}
      <NavLink
        to="/scheduleDoctor"
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-white text-cyan-500 shadow-lg border border-slate-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <LuClock3 className="text-2xl" />
        <span>Schedule</span>
      </NavLink>

      {/* Logout */}
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

export default SidebarDoctor