import { MdMonitorHeart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaStethoscope } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../supabaseClient";

const Sidebar = () => {
  return (
<div className="fixed left-0 top-0 w-64 min-h-screen bg-white border-r border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,.05)]">

  {/* Logo */}
  <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-200">

    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
      <MdMonitorHeart className="text-2xl text-white" />
    </div>

    <h1 className="text-[2rem] font-extrabold tracking-tight">
      <span className="text-slate-900">Medi</span>
      <span className="text-emerald-600">Core</span>
    </h1>

  </div>

  {/* Menu */}
  <div className="px-4 pt-8">

    <h2 className="px-2 text-sm font-bold tracking-wider uppercase text-slate-400">
      Administration
    </h2>

    <nav className="mt-6 flex flex-col gap-3">

      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700  shadow-md shadow-emerald-100/40"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <MdOutlineDashboard className="text-2xl transition-colors" />
        <span>Dashboard</span>
      </NavLink>

      {/* Patients */}
      <NavLink
        to="/patients"
        className={({ isActive }) =>
          `group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700  shadow-md shadow-emerald-100/40"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <FiUsers className="text-2xl transition-colors" />
        <span>Patients</span>
      </NavLink>

      {/* Doctors */}
      <NavLink
        to="/doctors"
        className={({ isActive }) =>
          `group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700  shadow-md shadow-emerald-100/40"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <FaStethoscope className="text-2xl transition-colors" />
        <span>Doctors</span>
      </NavLink>

      {/* Appointments */}
      <NavLink
        to="/appointments"
        className={({ isActive }) =>
          `group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100/40"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <IoCalendarClearOutline className="text-2xl transition-colors" />
        <span>Appointments</span>
      </NavLink>

      {/* Logout */}
      <button
        onClick={() => supabase.auth.signOut()}
        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 font-medium transition-all duration-300 hover:bg-red-50 hover:text-red-500"
      >
        <FiLogOut className="text-2xl" />
        <span>Log Out</span>
      </button>

    </nav>

  </div>

</div>
  )
}

export default Sidebar