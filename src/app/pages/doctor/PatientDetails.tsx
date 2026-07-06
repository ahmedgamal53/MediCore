import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, Query } from "@tanstack/react-query";
import { supabase } from "../../../supabaseClient";
import { useDeleteAppointment, useuseAppointmentid } from "../../../api/appointments";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

// ---------------------------------------------------------------------------
// Helper: fetch a single appointment with related patient, doctor, and vital signs
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// PatientDetails component – Doctor Dashboard
// ---------------------------------------------------------------------------
const PatientDetails = () => {
  const { id } = useParams<{ id: string }>(); // appointment/booking id from route
  const navigate = useNavigate();
  const queryClient = useQueryClient();

   const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
const [loading,setloading]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  // -------------------------------------------------------
  // Load the selected appointment (includes patient profile data)
  // -------------------------------------------------------
  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useuseAppointmentid(id)
  console.log('appointment',appointment);
  

  useEffect(()=>{
    if(appointment?.length){
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiagnosis(appointment[0]?.diagnosis ||"")
      setClinicalNotes(appointment[0]?.clinical_notes||"")
      setChiefComplaint(appointment[0]?.chief_complaint||"")
    }
  },[appointment])
  // -------------------------------------------------------
  // Load previous visits for the same patient (excluding current)
  // -------------------------------------------------------
  const patientId = appointment?.[0]?.patient_id;
  const {
    data: previousVisits,
    isLoading: loadingPrev,
    isError: errorPrev,
  } = useQuery({
    queryKey: ["appointments", patientId,id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`*, patients(*,profiles(*))`)
        .eq("patient_id", patientId)
        .neq("id", id) // exclude current
        .order("appointment_date", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    
    enabled: !!patientId&&!!id ,
  });



console.log('previousVisits',previousVisits
);


  


  const handleCancel =async () => {
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
        navigate(-1)
      queryClient.invalidateQueries({queryKey:['appointments']})
  } catch (error) {
    console.log(error);
    
  }
  };

  const handleSave =async () => {
  try {
    setloading(true)

    if(appointment?.[0]?.clinical_notes===clinicalNotes&&appointment?.[0]?.diagnosis===diagnosis&&appointment?.[0]?.chief_complaint===chiefComplaint){
toast.error("The data is already up to date.");
      setloading(false)
      return
    }
    const {error}=await supabase
    .from("appointments")
    .update(
      {
        clinical_notes:clinicalNotes,
        diagnosis:diagnosis,
        chief_complaint:chiefComplaint
      }
    )
    .eq('id',id)
        if(error){
 toast.error(error.message);

return;     
 }
toast.success("Changes saved successfully.");
     setloading(false)
      queryClient.invalidateQueries({queryKey:['appointments']})
  } catch (error) {
    console.log(error);
    
  }
  };

  // -------------------------------------------------------
  // Loading / error states
  // -------------------------------------------------------
  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading appointment details…</div>;
  }
  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load appointment details: {error?.message?.toString()}
      </div>
    );
  }







  const handelCompleted=async()=>{

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



const totalPages = Math.ceil((previousVisits?.length || 0) / itemsPerPage);

const paginatedVisits = previousVisits?.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
   <button
  onClick={() => navigate("/patient")}
  className="inline-flex items-center cursor-pointer gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-cyan-300 hover:text-cyan-600 hover:shadow-md active:scale-95"
>
  <span className="text-lg">←</span>
  Back to Patients
</button>
     {
      appointment?.map((a)=>(
           <div className="flex-1 text-center">
          <h1 className="text-2xl font-semibold">{a?.patients?.profiles.full_name ?? "Patient"}</h1>
          <p className="text-sm text-gray-600">
            Booking ID: {a?.booking_id} | Status: {a?.status}
          </p>
          <p className="text-sm text-gray-600">
            {a?.appointment_date} @ {a?.appointment_time}
          </p>
        </div>
      ))
     }
      <div className="flex flex-wrap items-center gap-3">
  {appointment?.some(
    (a) => a.status !== "Cancelled" && a.status !== "completed"
  ) && (
    <button
      onClick={handelCompleted}
      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,197,94,0.4)] active:scale-95"
    >
      ✓ Complete Visit
    </button>
  )}

  {appointment?.some(
    (a) => a.status !== "Cancelled" && a.status !== "completed"
  ) && (
    <button
      onClick={handleCancel}
      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(239,68,68,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(239,68,68,0.4)] active:scale-95"
    >
      ✕ Cancel Appointment
    </button>
  )}
</div>
      </div>

      {/* Patient Information */}
<section className="rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="mb-6 text-xl font-semibold text-slate-800">
    Patient Information
  </h2>

  {appointment?.map((a) => (
    <div
      key={a.id}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div>
        <p className="text-sm text-slate-500">Full Name</p>
        <p className="mt-1 font-medium text-slate-800">
          {a.patients.profiles.full_name}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Gender</p>
        <p className="mt-1 font-medium text-slate-800">
          {a.patients.gender}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Phone Number</p>
        <p className="mt-1 font-medium text-slate-800">
          {a.patients.phone}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Blood Type</p>
        <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
          {a.patients.Blood_Type}
        </span>
      </div>

      <div>
        <p className="text-sm text-slate-500">Date of Birth</p>
        <p className="mt-1 font-medium text-slate-800">
          {a.patients.date_of_birth}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Appointment Type</p>
        <p className="mt-1 font-medium text-slate-800">
          {a.type}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Status</p>
        <span
                className={`rounded-full mt-1 inline-block  px-3 py-1 text-sm font-medium border
    ${
      a?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : a?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : a?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}
        >
          {a.status}
        </span>
      </div>
    </div>
  ))}
</section>

      {/* Vital Signs */}
      {/* <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-medium mb-2">Vital Signs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EditableInput label="Height (cm)" value={height} setValue={setHeight} />
          <EditableInput label="Weight (kg)" value={weight} setValue={setWeight} />
          <EditableInput label="BMI" value={bmi} setValue={setBmi} />
          <EditableInput label="Blood Pressure" value={bloodPressure} setValue={setBloodPressure} />
          <EditableInput label="Heart Rate (bpm)" value={heartRate} setValue={setHeartRate} />
          <EditableInput label="Temperature (°C)" value={temperature} setValue={setTemperature} />
          <EditableInput label="Oxygen Saturation (%)" value={oxygenSat} setValue={setOxygenSat} />
        </div>
      </section> */}

      {/* Chief Complaint */}
<div >
{
  appointment?.map((a)=>(
    <div className="space-y-6">
        {/* Chief Complaint */}
  <section className="rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="mb-2 text-xl font-semibold text-slate-800">
      Chief Complaint
    </h2>
    <p className="mb-4 text-sm text-slate-500">
      Describe the patient's primary complaint. 
    </p>

    <textarea
      rows={4}
      value={chiefComplaint}
      onChange={(e) => setChiefComplaint(e.target.value)}
      placeholder="Enter the patient's chief complaint..."
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition "
    />
  </section>

  {/* Diagnosis */}
  <section className="rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="mb-2 text-xl font-semibold text-slate-800">
      Diagnosis
    </h2>
    <p className="mb-4 text-sm text-slate-500">
      Enter the doctor's diagnosis.
    </p>

    <textarea
      rows={4}
      value={diagnosis}
      onChange={(e) => setDiagnosis(e.target.value)}
      placeholder="Enter diagnosis..."
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition "
    />
  </section>

  {/* Clinical Notes */}
  <section className="rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="mb-2 text-xl font-semibold text-slate-800">
      Clinical Notes
    </h2>
    <p className="mb-4 text-sm text-slate-500">
      Add any clinical observations or recommendations.
    </p>

    <textarea
      rows={6}
      value={clinicalNotes}
      onChange={(e) => setClinicalNotes(e.target.value)}
      placeholder="Write clinical notes..."
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition "
    />
  </section>
    </div>
  ))
}
</div>

      {/* Previous Visits */}
   <section className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] overflow-hidden">
  <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
    <div>
      <h2 className="text-xl font-semibold text-slate-900">
        Previous Visits
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Review the patient's previous appointments and diagnoses.
      </p>
    </div>

    <div className="h-10 w-10 rounded-2xl bg-[#16B5E5] flex items-center justify-center">
      <span className=" text-white font-semibold">
        {previousVisits?.length ?? 0}
      </span>
    </div>
  </div>

  {loadingPrev ? (
    <div className="py-12 text-center text-slate-500">
      Loading previous visits...
    </div>
  ) : errorPrev ? (
    <div className="py-12 text-center text-red-500">
      Failed to load previous visits.
    </div>
  ) : previousVisits?.length ? (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Diagnosis</th>
            <th className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedVisits?.map((a: any) => (
            <tr
              key={a.id}
              className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors"
            >
              <td className="px-6 py-5 font-medium text-slate-800">
                {a.appointment_date}
              </td>

              <td className="px-6 py-5">
                <span
                         className={`rounded-full mt-1 inline-block  px-3 py-1 text-sm font-medium border
    ${
      a?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : a?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : a?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}
                >
                  {a.status}
                </span>
              </td>

              <td className="px-6 py-5 text-slate-600 max-w-md truncate">
                {a.diagnosis || "No diagnosis"}
              </td>

              <td className="px-6 py-5 text-right">
                <button
                  onClick={() => {
                    navigate(`/patient/${a.id}`);
                    scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                    setCurrentPage(1)
                  }}
    className="rounded-xl bg-[#16B5E5] cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0EA5D3]"
                >
                  View Visit →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



    </div>
  ) : (
    <div className="py-14 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        📋
      </div>

      <h3 className="font-semibold text-slate-700">
        No Previous Visits
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        This patient doesn't have any previous appointments yet.
      </p>
    </div>
  )}
</section>


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

      {/* Bottom actions */}
   <div className="mt-8 flex items-center justify-center  border-t border-slate-100 pt-6">
  <button
    onClick={handleSave}
    disabled={!(clinicalNotes.trim()&&diagnosis.trim()&&chiefComplaint.trim())}
    className="inline-flex items-center gap-2 rounded-2xl cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(14,165,233,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(14,165,233,0.45)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Save className="h-4 w-4" />
        Save Changes
      </>
    )}

    
  </button>
</div>
    </div>
  );
};

export default PatientDetails;
