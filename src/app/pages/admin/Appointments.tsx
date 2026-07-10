import { useMemo, useState } from "react"
import { useAppointment, useDeleteAppointment } from "../../../api/appointments"
import {
  IoSearchOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoMedkitOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoDocumentTextOutline,
  IoClose,
  IoPersonCircleOutline,
  IoStatsChartOutline,
} from "react-icons/io5"
import { FaRegCircleCheck } from "react-icons/fa6";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Appointments = () => {
  const { data: appointments, isLoading } = useAppointment()
const {mutate:deleteAppointment}=useDeleteAppointment()
  // Filters (UI-only state, does not touch the data fetching logic above)
  const [searchPatient, setSearchPatient] = useState("")
  const [searchDoctor, setSearchDoctor] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("")
  const [viewingAppointment, setViewingAppointment] = useState<any>(null)

  const [currentPage, setCurrentPage] = useState(1);
        
          const itemsPerPage = 10;
  // Small helpers to safely read fields regardless of exact join shape
  const getPatientName = (appt: any) => appt?.patients?.profiles?.full_name || "-"
  const getDoctorName = (appt: any) => appt?.doctors?.profiles?.full_name || "-"
  const getSpecialty = (appt: any) => appt?.doctors?.specialty || "-"
  const getStatus = (appt: any) =>  appt?.status || "-"
  const getType = (appt: any) =>  appt?.type || "-"

  const clearFilters = () => {
    setSearchPatient("")
    setSearchDoctor("")
    setStatusFilter("All")
    setDateFilter("")
  }

  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    return appointments.filter((appt: any) => {
      const matchesPatient = getPatientName(appt)
        .toLowerCase()
        .includes(searchPatient.toLowerCase())
      const matchesDoctor = getDoctorName(appt)
        .toLowerCase()
        .includes(searchDoctor.toLowerCase())
      const matchesStatus =
        statusFilter === "All" || getStatus(appt) === statusFilter
      const matchesDate = !dateFilter || appt.appointment_date === dateFilter
      return matchesPatient && matchesDoctor && matchesStatus && matchesDate
    })
  }, [appointments, searchPatient, searchDoctor, statusFilter, dateFilter])

  
  const stats = useMemo(() => {
    const list = appointments || []
    const today=new Date().toISOString().split("T")[0]
    
    
    return {
      total: list.length,
      today: list.filter((a: any) => a.appointment_date === today).length,
      completed: list.filter((a: any) =>
      a.status==="completed"
      ).length,
      cancelled: list.filter((a: any) =>  a.status=== "Cancelled").length,
    }
  }, [appointments])



  const typeStyles: Record<string, string> = {
 "check-up":
    "bg-[#E8FAF9] text-[#00A39C] border border-[#BDEDEA]",

  "follow-up":
    "bg-[#EEF8FF] text-[#0A84FF] border border-[#CFE7FF]",

  consultation:
    "bg-[#F5F0FF] text-[#8B5CF6] border border-[#E4D8FF]",

  emergency:
    "bg-[#FFF1F2] text-[#E11D48] border border-[#FFD6DC]",
}
 
  const queryClient = useQueryClient();

 const handelCompleted=async(id:string)=>{

  try {
    const {error}=await supabase.from('appointments')
    .update({
      status:'completed'
    })
    .eq('id',id)

    if(error){
 toast.error(error.message);
return;     
 }
    toast.success("completed successfully.");
      queryClient.invalidateQueries({queryKey:['appointments']})
  } catch (error) {
    console.log(error);
    
  }
}

  const handleCancel =async (id:string) => {
     try {
const {error}=await supabase.from('appointments')
.update({
  status:'Cancelled'
})
.eq('id',id)
    if(error){
toast.error("Failed to cancel the appointment.")
return;     
 }
        toast.success("Canseled successfully")
      queryClient.invalidateQueries({queryKey:['appointments']})
  } catch (error) {
    console.log(error);
    
  }
  };


   const totalPages=Math.ceil((filteredAppointments?.length||0)/itemsPerPage)
          const paginatedVisits=filteredAppointments?.slice(
            (currentPage-1)*itemsPerPage,
            currentPage*itemsPerPage
          )
  


  return (
    <div className="bg-[#F6F8FC] min-h-screen p-6 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Appointments</h2>
            <p className="text-slate-500 mt-1">View, filter, and manage every scheduled appointment</p>
          </div>
       
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoStatsChartOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-slate-500 text-xs font-medium">Total Appointments</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg shrink-0">
              <IoCalendarOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
              <div className="text-slate-500 text-xs font-medium">Today's Appointments</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
  <FaRegCircleCheck />
</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.completed}</div>
              <div className="text-slate-500 text-xs font-medium">Completed Appointments</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-lg shrink-0">
              <IoCloseCircleOutline />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.cancelled}</div>
              <div className="text-slate-500 text-xs font-medium">Cancelled Appointments</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <IoFilterOutline className="text-emerald-600" />
            <h3 className="text-slate-900 font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search patient..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none    transition-all"
              />
            </div>

            <div className="relative">
              <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search doctor..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none    transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-2xl text-sm text-slate-700 outline-none    transition-all"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">In Progress</option>
              <option value="completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-2xl text-sm text-slate-700 outline-none    transition-all"
            />

            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300"
            >
              <IoClose /> Clear filters
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,.06)] overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-slate-500">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide">Patient</th>
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide">Doctor</th>
                    <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Date</th>
                    <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Time</th>
                    <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Status</th>
                    <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVisits?.map((appt: any) => {
                    const status = getStatus(appt)
                    return (
                      <tr key={appt.id} className="border-t border-slate-100 hover:bg-emerald-50 transition">
                        <td className="px-4 py-4">
                          <div className="text-slate-900 font-medium">{getPatientName(appt)}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{appt.booking_id || "-"}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-slate-900 font-medium">Dr. {getDoctorName(appt)}</div>
                          <div className="text-emerald-600 text-xs mt-0.5">{getSpecialty(appt)}</div>
                        </td>
                        <td className="px-4 py-4 text-center">{(appt.appointment_date)}</td>
                        <td className="px-4 py-4 text-center">{appt.appointment_time || "-"}</td>
                        <td className="px-4 py-4 text-center">
                          <span 
                          className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      appt?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : appt?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : appt?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}                           >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-3 text-lg">
                            <button
                              title="View"
                              onClick={() => setViewingAppointment(appt)}
                              className="text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              <IoEyeOutline />
                            </button>
                          
                            {(status === "In Progress" || status === "Scheduled") && (
                              <button
                                title="Confirm"
                                onClick={()=>handelCompleted(appt.id)}
                                className="text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                              >
                                <IoCheckmarkCircleOutline />
                              </button>
                            )}
                            {status !== "Cancelled" && status !== "completed" && (
                              <button
                                title="Cancel"
                                onClick={() =>handleCancel(appt.id)}
                                className="text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
                              >
                                <IoCloseCircleOutline />
                              </button>
                            )}
                            <button
                              title="Delete"
                              onClick={() =>deleteAppointment(appt.id)}
                              className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <IoTrashOutline />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3">
                <IoCalendarOutline />
              </div>
              <p className="font-medium text-slate-700">No appointments found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or check back later</p>
            </div>
          )}


                 <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-sm font-medium text-slate-700">
      Page <span className="text-emerald-600">{currentPage}</span> of{" "}
      <span className="text-slate-900">{totalPages}</span>
    </p>

 
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
    >
      ← Previous
    </button>

    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all duration-200
            ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
    >
      Next →
    </button>
  </div>
</div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {viewingAppointment && (
        <div
          onClick={() => setViewingAppointment(null)}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/25 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-[30px] shadow-[0_25px_80px_rgba(15,23,42,.12)] w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <IoPersonCircleOutline className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-slate-900 text-lg font-semibold">Appointment Details</h3>
                  <p className="text-slate-500 text-sm">{viewingAppointment.booking_id || "-"}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="col-span-2 bg-slate-50 rounded-2xl p-4">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Patient</div>
                <div className="text-slate-900 font-semibold">{getPatientName(viewingAppointment)}</div>
              </div>
              <div className="col-span-2 bg-slate-50 rounded-2xl p-4">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Doctor</div>
                <div className="text-slate-900 font-semibold">Dr. {getDoctorName(viewingAppointment)}</div>
                <div className="text-emerald-600 text-xs mt-0.5 flex items-center gap-1">
                  <IoMedkitOutline /> {getSpecialty(viewingAppointment)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                  <IoCalendarOutline /> Date
                </div>
                <div className="text-slate-900 font-semibold">{(viewingAppointment.appointment_date)}</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                  <IoTimeOutline /> Time
                </div>
                <div className="text-slate-900 font-semibold">{viewingAppointment.appointment_time || "-"}</div>
              </div>

              <div className="col-span-2  bg-slate-50 rounded-2xl p-4">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Status</div>
                <span 
                          className={`rounded-full px-3 py-1 mr-2 text-sm font-medium border
    ${
      viewingAppointment?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : viewingAppointment?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : viewingAppointment?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}                 >
                  {(viewingAppointment.status)}
                </span>
                {getType(viewingAppointment) !== "-" && (
                  <span 
                   className={`text-[13px] font-semibold tracking-wide px-4 py-2 rounded-full ${
              typeStyles[viewingAppointment.type] ??
              "bg-gray-500/10 text-gray-600 border border-gray-500/20"
            }`}                  >
                    {getType(viewingAppointment)}
                  </span>
                )}
              </div>
            </div>

            {(viewingAppointment.chief_complaint || viewingAppointment.diagnosis || viewingAppointment.clinical_notes) && (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2">
                  <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Chief Complaint</div>
                    <div className="text-slate-700 text-sm mt-0.5">{viewingAppointment.chief_complaint || "Not recorded"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Diagnosis</div>
                    <div className="text-slate-700 text-sm mt-0.5">{viewingAppointment.diagnosis || "Not recorded"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Notes</div>
                    <div className="text-slate-700 text-sm mt-0.5">{viewingAppointment.clinical_notes || "Not recorded"}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingAppointment(null)}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments