import { useAppointmentDoctorid } from "../../../api/appointments";
import { usePatiens } from "../../../api/Patients";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { CalendarDays, Stethoscope } from "lucide-react";



const DashbordDoctor = () => {
  const { data: appointments, isLoading: loadingAppointments } =useAppointmentDoctorid();
  const { data: patients, isLoading: loadingPatients } = usePatiens();

  const navigate = useNavigate();

  console.log('appointments',appointments);
  

  // Compute KPI counts
  const today = new Date().toISOString().split("T")[0];

  
  const kpis = useMemo(() => {
    if (!appointments) return {};
    const todayCount = appointments.filter(
      (a) => a.appointment_date === today
    ).length;
    const completed = appointments.filter(
      (a) => a.status === "completed"
    ).length;
    const InProgress = appointments.filter(
      (a) => a.status === "In Progress"
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "Cancelled"
    ).length;
    const totalPatients = appointments.filter((a)=>a.status !=='Cancelled'&&a.status !=='completed' ).length || 0;
    return { todayCount, completed, InProgress, cancelled, totalPatients };
  }, [appointments, patients, today]);

  // Weekly appointments for bar chart (Monday‑Sunday of current week)
  const weeklyData = useMemo(() => {
    if (!appointments) return [];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    const weekMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      weekMap[key] = 0;
    }
    appointments.forEach((a) => {
      const key = a.appointment_date;
      if (key in weekMap) weekMap[key]++;
    });
    return Object.entries(weekMap).map(([date, count]) => ({ date, count }));
  }, [appointments]);

  // Status distribution for pie/bar chart
  const statusData = useMemo(() => {
    if (!appointments) return [];
    const map: Record<string, number> = {};
    appointments.forEach((a) => {
      const s = a.status ?? "Unknown";
      if (map[s]) {
  map[s] = map[s] + 1;
} else {
  map[s] = 1;
}
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [appointments]);

  // Daily visit trends (last 14 days)
  const trendData = useMemo(() => {
    if (!appointments) return [];
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }
    appointments.forEach((a) => {
      const key = a.appointment_date;
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [appointments]);

  // Today schedule list
  const todaySchedule = appointments?.filter(
    (a) => a.appointment_date === today
  );


  
  // Recent patients (last 5 by created_at)
  const recentPatients = useMemo(() => {
   
    const recent=appointments?.filter((a)=>a.status !=="Cancelled"  &&new Date(`${a.appointment_date}T${a.appointment_time}`)<=new Date).sort((a,b)=>
    new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() -
      new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
    )
    return recent?.slice(0, 5);
  }, [appointments]);

  if (loadingAppointments || loadingPatients) {
    return (
      <div className="p-6 text-center text-gray-600">Loading dashboard...</div>
    );
  }
  console.log('recentPatients',recentPatients);
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {kpis.todayCount ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Completed Visits</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {kpis.completed ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">In Progress Appointments</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {kpis.InProgress ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Cancelled Appointments</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {kpis.cancelled ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {kpis.totalPatients ?? 0}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Appointments Bar */}
        <div className="bg-white rounded-xl shadow p-4 h-64">
          <h3 className="text-lg font-medium mb-2">Weekly Appointments</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" })} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow p-4 h-64">
          <h3 className="text-lg font-medium mb-2">Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" margin={{ top: 3, right: 20, left: 23, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number"  />
              <YAxis dataKey="status" type="category" />
              <Tooltip />
                <Bar

                  dataKey="count"
                  fill={ "#6b7280"}
                />
              
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend Line Chart */}
      <div className="bg-white rounded-xl shadow p-4 h-64">
        <h3 className="text-lg font-medium mb-2">Daily Visit Trends (Last 14 days)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Today Schedule */}
   <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
  <h3 className="mb-4 text-lg font-semibold text-gray-900">
    Today's Schedule
  </h3>

  {todaySchedule && todaySchedule.length > 0 ? (
    <ul className="space-y-3">
      {todaySchedule.map((a) => (
        <li
          key={a.id}
          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <p className="text-base font-semibold text-gray-900">
              {a.patients?.profiles?.full_name || "Untitled"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {a.appointment_time} • {a.type}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold border whitespace-nowrap
              ${
                a?.status === "Scheduled"
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : a?.status === "In Progress"
                  ? "bg-cyan-100 text-cyan-700 border-cyan-200"
                  : a?.status === "completed"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
          >
            {a.status}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200">
      <p className="text-sm text-gray-500">
        No appointments for today.
      </p>
    </div>
  )}
</div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-medium mb-4">Recent Patients</h3>
        {recentPatients && recentPatients.length > 0 ? (
          <ul className="space-y-2">
            {recentPatients.map((p) => (
              <li 
              onClick={()=>navigate(`/patient/${p.id}`)}
              key={p.id} className="flex justify-between items-center   rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <p className="font-medium">{p.patients?.profiles?.full_name || "Unnamed"}</p>
                <p className="text-sm text-gray-500">{p.appointment_date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent patients.</p>
        )}
      </div>

      {/* Quick Actions */}

<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Quick Actions
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Access the most frequently used actions.
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => navigate("/scheduleDoctor")}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
      >
        <CalendarDays size={18} />
        View Schedule
      </button>

      <button
        onClick={() => navigate("/visits")}
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
      >
        <Stethoscope size={18} />
        Start Visit
      </button>
    </div>
  </div>
</div>
    </div>
  );
};

export default DashbordDoctor;
