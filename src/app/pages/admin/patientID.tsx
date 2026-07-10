import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoArrowBackCircle, IoCallOutline, IoCalendarOutline, IoMaleFemaleOutline, IoWaterOutline, IoPulseOutline, IoShieldCheckmarkOutline, IoTimeOutline, IoMedkitOutline, IoDocumentTextOutline, IoPersonCircleOutline } from "react-icons/io5";
import { usePatientDetails } from "../../../api/Patients";
import { RingLoader } from "react-spinners";
import { useAppointmentPatient } from "../../../api/appointments";
import { useState } from "react";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatientDetails(id ?? "");

const [currentPage, setCurrentPage] = useState(1);
        
          const itemsPerPage = 5;
            const {data:appointmentPatient}=useAppointmentPatient(id)

console.log('appointmentPatient',appointmentPatient);

      const totalPages=Math.ceil((appointmentPatient?.length||0)/itemsPerPage)
          const paginatedVisits=appointmentPatient?.slice(
            (currentPage-1)*itemsPerPage,
            currentPage*itemsPerPage
          )

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

  if (isLoading) {
   return(
             <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
        )  }

  if (error || !patient) {
    toast.error("Failed to load patient");
    return <div className="p-4 text-red-400">Error loading patient information.</div>;
  }

  const profile = patient.profiles || {};

  return (
    <div className="bg-[#F6F8FC] min-h-screen p-6 md:p-10 text-slate-900">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm font-semibold cursor-pointer text-emerald-600 hover:text-emerald-700 transition-all duration-300">
        <IoArrowBackCircle className="text-2xl" /> Back
      </button>

      <div className="max-w-5xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,.06)] p-6 md:p-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
            {(profile.full_name || "-").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{profile.full_name || "-"}</h2>
            <p className="text-slate-500 text-sm mt-0.5">Patient Details</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {patient.Blood_Type || "-"}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                profile.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-500 border-red-100"
              }`}
            >
              {profile.status || "-"}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoCallOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Phone</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{patient.phone || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoCalendarOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Date of Birth</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{(patient.date_of_birth)}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoMaleFemaleOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Gender</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{patient.gender || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoWaterOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Blood Type</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{patient.Blood_Type || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoPulseOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Account Status</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{profile.status || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <IoShieldCheckmarkOutline />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Role</div>
              <div className="text-slate-900 text-lg font-semibold mt-0.5">{profile.role || "-"}</div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,.06)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Appointments</h3>
              <p className="text-slate-500 text-sm mt-0.5">Visits scheduled for this patient</p>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {appointmentPatient?.length || 0} total
            </span>
          </div>

          {appointmentPatient && appointmentPatient.length > 0 ? (
            <div className="space-y-4">
              {paginatedVisits?.map((appt: any) => (
                <div
                  key={appt.id}
                  className="rounded-2xl border border-slate-200 p-5 hover:bg-emerald-50/40 hover:border-emerald-100 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                        {/* <IoPersonCircleOutline className="text-2xl" /> */}
                                                   {appt.doctors?.profiles?.full_name ?.split('.')
                              ?.map((a:string)=>a[0])
                              ?.join('')
                              .slice(0,2)
                              .toUpperCase()
                               || "-"}
                      </div>
                      <div>
                        <div className="text-slate-900 font-semibold">
                           {appt.doctors?.profiles?.full_name 
                              || "-"}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                          <IoMedkitOutline className="text-emerald-600" /> {appt.doctors?.specialty || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        <IoCalendarOutline /> {appt.appointment_date || "-"}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        <IoTimeOutline /> {appt.appointment_time || "-"}
                      </span>
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
  `} 
                      >
                        {appt.status  || "-"}
                      </span>
                      {(appt.type || appt.doctors?.type) && (
                        <span 
                className={`text-[13px] font-semibold tracking-wide px-4 py-2 rounded-full ${
              typeStyles[appt.type] ??
              "bg-gray-500/10 text-gray-600 border border-gray-500/20"
            }`}                         >
                          {appt.type }
                        </span>
                      )}
                    </div>
                  </div>

                  {(appt.chief_complaint || appt.diagnosis || appt.clinical_notes) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-start gap-2">
                        <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Chief Complaint</div>
                          <div className="text-slate-700 text-sm mt-0.5">{appt.chief_complaint || "Not recorded"}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Diagnosis</div>
                          <div className="text-slate-700 text-sm mt-0.5">{appt.diagnosis || "Not recorded"}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <IoDocumentTextOutline className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Clinical Notes</div>
                          <div className="text-slate-700 text-sm mt-0.5">{appt.clinical_notes || "Not recorded"}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <IoCalendarOutline className="text-3xl mb-2 text-slate-300" />
              No appointments found
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
    </div>
  );
};

export default PatientDetail;