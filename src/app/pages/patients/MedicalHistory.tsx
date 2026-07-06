import   { useState } from 'react'
import { useAppointmentid } from '../../../api/appointments'
import {
  ArrowLeft,
  User,
  Phone,
  Droplet,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  ClipboardList,
  Hash,
  CalendarClock,
  Search,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ---- Types (based on the observed appointment shape) ----
interface Doctor {
  id: string
  phone: string
  profiles?: { full_name?: string }
  specialty?: string
}

interface Patient {
  id: string
  phone: string
  gender: string
  Blood_Type: string
  date_of_birth: string
  profiles?: { full_name?: string }
}

interface Appointment {
  id: number
  booking_id: string
  appointment_date: string
  appointment_time: string
  chief_complaint: string | null
  clinical_notes: string | null
  diagnosis: string | null
  status: 'Scheduled' | 'Completed' | 'Cancelled' | string
  type: string
  doctor_id: string
  patient_id: string
  doctors?: Doctor
  patients?: Patient
}



const formatTime = (time: string) => {
const [h, m] = time.split(':').map(Number)
const sufix=h>12?'PM':'AM'
 const hour=
 h===12?0:h>12?h-12:h
  return `${hour}:${m.toString().padStart(2,"0")} ${sufix} `
}

 
  





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

const MedicalHistory = () => {
  const { data: appointments, isLoading } = useAppointmentid() as {
    data: Appointment[] | undefined
    isLoading: boolean
  }
  const navigate = useNavigate()
   const [currentPage, setCurrentPage] = useState(1);
   const [search, setsearch] = useState('');

  const itemsPerPage = 5;


  const patient = appointments?.[0]?.patients

  // Most recent first
  const sorted = appointments
    ? [...appointments].sort(
        (a, b) =>
          new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() -
          new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
      )
    : []

const filtered=sorted.filter((a)=>{
    return a.doctors?.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || a.booking_id.split("-")[2].includes(search)
})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8E8E93]">
          <div className="w-5 h-5 border-2 border-[#00C7BE] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading medical history...</span>
        </div>
      </div>
    )
  }

  const totalPages=Math.ceil((filtered.length)/itemsPerPage)
  console.log(totalPages);
  const paginatedVisits=filtered.slice(
  (currentPage-1)*itemsPerPage,
  currentPage*itemsPerPage
  )
  return (
    <div className="min-h-screen bg-[#F5F5F7] font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display',sans-serif] p-6 md:p-10 space-y-8">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white/70 backdrop-blur-3xl border border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]  focus:outline-none focus:ring-2 focus:ring-[#00C7BE]/40 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-[#1D1D1F]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">
            Medical <span className="text-[#00C7BE]">History</span>
          </h1>
          <p className="text-[15px] text-[#8E8E93] mt-0.5">Full record of past and upcoming visits</p>
        </div>
      </div>

      {/* Patient summary card */}
      {patient && (
        <div className="rounded-[32px] bg-white/70 backdrop-blur-3xl border border-white/60 shadow-[0_2px_30px_rgba(0,0,0,0.05)] p-7 md:p-8  transition-all duration-300">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E0D6] to-[#00A39C] shadow-lg shadow-[#00C7BE]/25 flex items-center justify-center shrink-0">
              <User className="w-9 h-9 text-white" strokeWidth={1.75} />
            </div>

            <div className="flex-1 min-w-[180px]">
              <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
                {patient.profiles?.full_name ?? 'Unknown Patient'}
              </h2>
              <p className="text-[15px] text-[#8E8E93] mt-1">
                {patient.gender} 
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2.5 bg-white/80 rounded-2xl px-4 py-2.5 border border-white/60">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[11px] text-[#8E8E93] leading-none">Blood Type</p>
                  <p className="text-sm font-semibold text-[#1D1D1F] leading-tight mt-0.5">{patient.Blood_Type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 rounded-2xl px-4 py-2.5 border border-white/60">
                <div className="w-8 h-8 rounded-xl bg-[#E8FAF9] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#00A39C]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#8E8E93] leading-none">Date of Birth</p>
                  <p className="text-sm font-semibold text-[#1D1D1F] leading-tight mt-0.5">
                    {(patient.date_of_birth)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 rounded-2xl px-4 py-2.5 border border-white/60">
                <div className="w-8 h-8 rounded-xl bg-[#E8FAF9] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#00A39C]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#8E8E93] leading-none">Phone</p>
                  <p className="text-sm font-semibold text-[#1D1D1F] leading-tight mt-0.5">{patient.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* search */}
<div className="rounded-2xl bg-white/75 backdrop-blur-3xl border border-white/70 shadow-[0_8px_30px_rgba(15,23,42,0.05)] px-5 py-4 transition-all duration-300 ">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-[#E8FAF9] flex items-center justify-center shrink-0">
      <Search
        className="w-5 h-5 text-[#00BFB3]"
        strokeWidth={2.2}
      />
    </div>

    <input
      type="text"
      value={search}
      onChange={(e) => setsearch(e.target.value)}
      placeholder="Search by booking ID or doctor's name..."
      className="flex-1 bg-transparent outline-none text-[15px] font-medium text-[#1D1D1F] placeholder:text-[#8E8E93]"
    />
  </div>
</div>

      {/* Timeline */}
      {sorted.length === 0 ? (
        <div className="rounded-[32px] bg-white/70 backdrop-blur-3xl border border-white/60 shadow-[0_2px_30px_rgba(0,0,0,0.05)] p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E8FAF9] flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-[#00C7BE]" strokeWidth={1.75} />
          </div>
          <p className="text-[#1D1D1F] font-semibold text-lg">No medical history yet</p>
          <p className="text-[15px] text-[#8E8E93] mt-1">Visits will appear here once recorded.</p>
        </div>
      ) : (
        <div className="relative ">

          <div className="space-y-6">
         {paginatedVisits.map((apt) => (
  <div key={apt.id} className="relative">
    <div className="rounded-[32px] bg-white/75 backdrop-blur-3xl border border-white/70 shadow-[0_8px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300 p-7">

      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap gap-5 mb-7">
        <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium">

          <div className="flex items-center gap-2 rounded-full bg-[#F2FDFC] px-4 py-2 text-[#3A3A3C]">
            <Calendar
              className="w-[18px] h-[18px] text-[#00BFB3]"
              strokeWidth={2.2}
            />
            <span>{apt.appointment_date}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#F2FDFC] px-4 py-2 text-[#3A3A3C]">
            <Clock
              className="w-[18px] h-[18px] text-[#00BFB3]"
              strokeWidth={2.2}
            />
            <span>{formatTime(apt.appointment_time)}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#F7F7F8] px-4 py-2 text-[#8E8E93]">
            <Hash className="w-4 h-4" strokeWidth={2.2} />
            <span>{apt.booking_id}</span>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <span
            className={`text-[13px] font-semibold tracking-wide px-4 py-2 rounded-full ${
              typeStyles[apt.type] ??
              "bg-gray-500/10 text-gray-600 border border-gray-500/20"
            }`}
          >
            {apt.type}
          </span>

          <span
                   className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      apt?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : apt?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : apt?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `} 
          >
            {apt.status}
          </span>

        </div>
      </div>

      {/* Doctor */}
      {apt.doctors && (
        <div className="flex items-center gap-4 mb-7 pb-7 border-b border-[#ECECEC]">

          <div className="w-11 h-11 rounded-2xl bg-[#E8FAF9] flex items-center justify-center shadow-sm">
            <Stethoscope
              className="w-5 h-5 text-[#00BFB3]"
              strokeWidth={2.2}
            />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8E8E93]">
              Attending Doctor
            </p>

            <p className="text-[16px] font-semibold text-[#1D1D1F] mt-1">
               {apt.doctors.profiles?.full_name ?? "—"}

              {apt.doctors.specialty && (
                <span className="font-normal text-[#636366]">
                  {" "}
                  · {apt.doctors.specialty}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Clinical Cards */}
      <div className="grid sm:grid-cols-3 gap-5">

        {/* Complaint */}

        <div className="rounded-[24px] bg-white/80 border border-[#ECECEC] p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-[#E8FAF9] flex items-center justify-center">
              <FileText
                className="w-[18px] h-[18px] text-[#00BFB3]"
                strokeWidth={2.2}
              />
            </div>

            <span className="text-[15px] font-semibold text-[#1D1D1F]">
              Chief Complaint
            </span>

          </div>

          <p
            className={`text-[15px] leading-7 ${
              apt.chief_complaint
                ? "text-[#3A3A3C] font-medium"
                : "text-[#AEAEB2] italic"
            }`}
          >
            {apt.chief_complaint ?? "Not recorded"}
          </p>

        </div>

        {/* Diagnosis */}

        <div className="rounded-[24px] bg-white/80 border border-[#ECECEC] p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-[#E8FAF9] flex items-center justify-center">
              <ClipboardList
                className="w-[18px] h-[18px] text-[#00BFB3]"
                strokeWidth={2.2}
              />
            </div>

            <span className="text-[15px] font-semibold text-[#1D1D1F]">
              Diagnosis
            </span>

          </div>

          <p
            className={`text-[15px] leading-7 ${
              apt.diagnosis
                ? "text-[#3A3A3C] font-medium"
                : "text-[#AEAEB2] italic"
            }`}
          >
            {apt.diagnosis ?? "Not recorded"}
          </p>

        </div>

        {/* Notes */}

        <div className="rounded-[24px] bg-white/80 border border-[#ECECEC] p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-[#E8FAF9] flex items-center justify-center">
              <CalendarClock
                className="w-[18px] h-[18px] text-[#00BFB3]"
                strokeWidth={2.2}
              />
            </div>

            <span className="text-[15px] font-semibold text-[#1D1D1F]">
              Clinical Notes
            </span>

          </div>

          <p
            className={`text-[15px] leading-7 ${
              apt.clinical_notes
                ? "text-[#3A3A3C] font-medium"
                : "text-[#AEAEB2] italic"
            }`}
          >
            {apt.clinical_notes ?? "Not recorded"}
          </p>

        </div>

      </div>
    </div>
  </div>
))}
          </div>
        </div>
      )}


    <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-sm font-medium text-slate-700">
      Page <span className="text-cyan-600">{currentPage}</span> of{" "}
      <span className="text-slate-900">{totalPages}</span>
    </p>

 
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
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
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105"
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
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
    >
      Next →
    </button>
  </div>
</div>

</div>
  )
}

export default MedicalHistory