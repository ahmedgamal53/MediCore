import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePatiens } from "../../../api/Patients";
import { useDoctors } from "../../../api/Doctors";
import { useAppointment } from "../../../api/appointments";
import {
  IoPersonOutline,
  IoBriefcaseOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoStatsChartOutline,

} from "react-icons/io5";
// Recharts components for professional charts
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRecentActivity } from "../../../api/recentactivity";
import { FaUserDoctor } from "react-icons/fa6";

const Dashboard = () => {
  const navigate = useNavigate();

  // Data fetching hooks
  const { data: patients, isLoading: loadingPatients } = usePatiens();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: appointments, isLoading: loadingAppointments } = useAppointment();

const {data:recentactivity}=useRecentActivity()
console.log('recentactivity',recentactivity);

  // Current date string for "today"
  const today = new Date().toISOString().split("T")[0];

  // Derived statistics (memoized)
  const {
    totalPatients,
    totalDoctors,
    totalAppointments,
    todaysAppointments,
    recentAppointments,
    recentPatients,
    activityTimeline,
  } = useMemo(() => {
    const totalPatients = patients?.length ?? 0;
    const totalDoctors = doctors?.length ?? 0;
    const totalAppointments = appointments?.length ?? 0;
    const todaysAppointments = appointments?.filter((a) => a.appointment_date === today).length ?? 0;

    // Recent appointments – newest first, limited to 5
    const now=new Date()
    const recentAppointments = (appointments ?? [])
      .filter((a)=>a.status !=='Cancelled'&&a.status !=='completed' && new Date(`${a.appointment_date}T${a.appointment_time}` ) >= now )
      .sort((a, b) => {
        const da = new Date(`${a.appointment_date}T${a.appointment_time}`);
        const db = new Date(`${b.appointment_date}T${b.appointment_time}`);
        return da.getTime() - db.getTime();
      })
      .slice(0, 5);

      console.log(patients);
      
    // Recent patients – newest first (use created_at if available)
    const recentPatients = (patients ?? [])
      .slice()
      .sort((a, b) => {
        const da = new Date(a.created_at ?? 0);
        const db = new Date(b.created_at ?? 0);
        return db.getTime() - da.getTime();
      })
      .slice(0, 5);

    // Build a simple activity timeline mixing recent appointments and patient adds
    const activity: Array<{ timestamp: number; icon: JSX.Element; text: string }> = [];
    recentAppointments.forEach((appt) => {
      const ts = new Date(`${appt.appointment_date}T${appt.appointment_time}`).getTime();
      const patientName = appt.patients?.profiles?.full_name ?? "[Patient]";
      const doctorName = appt.doctors?.profiles?.full_name ?? "[Doctor]";
      activity.push({
        timestamp: ts,
        icon: <IoCalendarOutline className="text-emerald-600" />, 
        text: `Appointment scheduled: ${patientName} with Dr. ${doctorName}`,
      });
    });

    
    recentPatients.forEach((p) => {
      const ts = new Date(p.created_at ?? 0).getTime();
      const name = p.profiles?.full_name ?? "[Patient]";
      activity.push({
        timestamp: ts,
        icon: <IoPersonOutline className="text-emerald-600" />, 
        text: `New patient added: ${name}`,
      });
    });
  

    activity.sort((a, b) => b.timestamp - a.timestamp);
    const activityTimeline = activity.slice(0, 5);

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      todaysAppointments,
      recentAppointments,
      recentPatients,
      activityTimeline,
    };
  }, [patients, doctors, appointments, today]);

  // Weekly appointments count for each day of the current week (Monday‑Sunday)
  const weeklyData = useMemo(() => {
    if (!appointments) return [];
    const start = new Date();
    // Set to Monday of the current week
    start.setDate(start.getDate() - start.getDay() + 1);
    const map: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      map[key] = 0;
    }
    appointments.forEach((a) => {
      const key = a.appointment_date;
      if (key && map[key] !== undefined) {
        map[key] += 1;
      }
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [appointments]);

  // Distribution of appointment statuses
 

// Colors for donut chart segments
const statusColors = ["#10b981", "#a3a3a3", "#f87171", "#60a5fa"]; // Completed, Scheduled, Cancelled, No Show
// Donut chart data for status distribution
const donutData = useMemo(() => {
  const categories = { Completed: 0, Scheduled: 0, Cancelled: 0, "In Progress": 0 };
  appointments?.forEach((a) => {
    const s = (a.status ?? "").toLowerCase();
    if (s === "completed") categories.Completed += 1;
    else if (s === "scheduled") categories.Scheduled += 1;
    else if (s === "cancelled") categories.Cancelled += 1;
    else if (s === "no show") categories["In Progress"] += 1;
  });
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
}, [appointments]);

  // Loading placeholder for the whole page – keep UI responsive
  const isLoading = loadingPatients || loadingDoctors || loadingAppointments;



const renderActivity =(act:any)=>{
  switch (act.type){
    case "doctor_created":
    return(
          <div className="flex  items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FaUserDoctor  className="text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">
              {new Date(act.created_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>

            <p className="text-slate-900">
              {act.title}: {act.doctor_name}
            </p>
          </div>
        </div>
    )
    case "patient_created":
      return(
          <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <IoPersonOutline className="text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">
              {new Date(act.created_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>

            <p className="text-slate-900">
              {act.title}: {act.patient_name}
            </p>
          </div>
        </div>
      )
      case "appointment_created":
      return(
          <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <IoCalendarOutline  className="text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">
              {new Date(act.created_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>

            <p className="text-slate-900">
              {act.title}: {act.patient_name} with Dr.{act.patient_name}
            </p>
          </div>
        </div>
      )
  }
}


  return (
    <div className="bg-[#F6F8FC] min-h-screen p-6 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome, Admin</h2>
          <p className="text-slate-500 mt-1">Here’s a quick snapshot of the system.</p>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Patients */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoPersonOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{isLoading ? "…" : totalPatients}</div>
              <div className="text-slate-500 text-xs font-medium">Total Patients</div>
            </div>
          </div>
          {/* Total Doctors */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoBriefcaseOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{isLoading ? "…" : totalDoctors}</div>
              <div className="text-slate-500 text-xs font-medium">Total Doctors</div>
            </div>
          </div>
          {/* Total Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoStatsChartOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{isLoading ? "…" : totalAppointments}</div>
              <div className="text-slate-500 text-xs font-medium">Total Appointments</div>
            </div>
          </div>
          {/* Today's Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoTimeOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{isLoading ? "…" : todaysAppointments}</div>
              <div className="text-slate-500 text-xs font-medium">Today's Appointments</div>
            </div>
          </div>
        </section>

        {/* Charts Section – Professional visualisations */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Weekly Appointments Trend – smooth line chart */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 h-64">
            <h3 className="text-lg font-medium mb-2">Weekly Appointments</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" })}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(15,23,42,.08)" }}
                  labelFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Appointment Status Distribution – donut chart */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 h-64">
            <h3 className="text-lg font-medium mb-2">Appointment Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(15,23,42,.08)" }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-8">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/patients")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Add Patient
            </button>
            <button
              onClick={() => navigate("/doctors")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Add Doctor
            </button>
           
          </div>
        </section>

        {/* Recent Appointments Table */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Upcoming Appointments</h3>
            <button
              onClick={() => navigate("/appointments")}
              className="text-emerald-600 hover:underline text-sm"
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,.06)] overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : recentAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-slate-500">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide">Patient</th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide">Doctor</th>
                      <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Date</th>
                      <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Time</th>
                      <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appt: any) => {
                      const status = appt.status ?? "-";
                      const statusColor =
                        status === "Scheduled"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : status === "In Progress"
                          ? "bg-cyan-100 text-cyan-700 border-cyan-200"
                          : status === "completed"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-red-100 text-red-700 border-red-200";
                      return (
                        <tr key={appt.id} className="border-t border-slate-100 hover:bg-emerald-50 transition">
                          <td className="px-4 py-4">
                            <div className="text-slate-900 font-medium">
                              {appt.patients?.profiles?.full_name || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-slate-900 font-medium">
                              Dr. {appt.doctors?.profiles?.full_name || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">{appt.appointment_date}</td>
                          <td className="px-4 py-4 text-center">{appt.appointment_time || "-"}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`rounded-full px-3 py-1 text-sm font-medium border ${statusColor}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <IoCalendarOutline className="text-3xl mb-2 text-slate-300" />
                <p>No recent appointments.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Patients List */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Recent Patients</h3>
            <button
              onClick={() => navigate("/patients")}
              className="text-emerald-600 hover:underline text-sm"
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : recentPatients.length > 0 ? (
              <ul className="space-y-3">
                {recentPatients.map((p: any) => (
                  <li
                    key={p.id}
                    className="flex justify-between items-center rounded-2xl border border-slate-200 bg-white p-3 hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <span className="font-medium text-slate-900">
                      {p.profiles?.full_name || "-"}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(p.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">No recent patients.</p>
            )}
          </div>
        </section>

        {/* Recent Activity Timeline */}
     


        <section className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            {recentactivity?.length ? (
              <div className="space-y-4">

                {recentactivity.map((act, idx) => (
                  <div key={idx} className="flex items-start  gap-3">
                  
               {
                renderActivity(act)
               }
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No recent activity.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;