import { CalendarDays, CheckCircle2, Play } from 'lucide-react'
import { useAppointmentDoctorid } from '../../../api/appointments';

import { Clipboard } from "lucide-react";
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { RingLoader } from 'react-spinners';
import { useState } from 'react';
const PatientVisit = () => {

  const [notes,setnotes]=useState('')
const [diagnosis,setdiagnosis]=useState('')
const [chiefComplaint,setChiefComplaint]=useState('')
      const {data: userAppointments,isLoading}=useAppointmentDoctorid();
  const now=new Date()
  const upcoming=userAppointments?.filter((a)=>a.status !=="Cancelled" &&a.status !=="completed"&&new Date(`${a.appointment_date}T${a.appointment_time}`)>=now).sort((a,b)=>
  {
     if (a.appointment_date !== b.appointment_date) {
      return a.appointment_date.localeCompare(b.appointment_date);
    }else{
      return  a.appointment_time.localeCompare(b.appointment_time);

    }
  }
  )
if(isLoading){
  return (
       <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
  )
}

  console.log('upcoming',upcoming);

  const appointment = upcoming?.[0];
  

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient=useQueryClient()
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

const handleStart=async(id:string)=>{
    try {
const {error}=await supabase.from('appointments')
.update({
  status:'In Progress'
})
.eq('id',id)
    if(error){
 toast.error("Failed to start the visit.");
return;     
 }

        toast.success("Appointment is now in progress.");
      queryClient.invalidateQueries({queryKey:['appointments']})
  } catch (error) {
    console.log(error);
    
  }
}


const handelCompleted=async(id:string)=>{

  try {
    const {error}=await supabase.from('appointments')
    .update({
      status:'completed',
      clinical_notes:notes,
      diagnosis:diagnosis,
      chief_complaint:chiefComplaint
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




  const formatTim=(time:string)=>{
    const [hour,minute]=time.split(":").map(Number)

    const displayHour=
    hour===0?12:hour>12?hour-12:hour
    return `${displayHour}:${minute.toString().padStart(2,"0")}`
  }



  return (
     <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen ">
      <div >
        
       <div className="sticky top-0 z-20 flex items-center justify-between
 border border-slate-200/70
bg-white/80 backdrop-blur-2xl
px-8 py-4 shadow-xl">

  <div className="flex items-center gap-5">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 shadow-lg shadow-cyan-500/20">
      <CalendarDays className="h-6 w-6 text-white" />
    </div>

    <div className="flex items-center gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        Medi<span className="text-cyan-500">Core</span>
      </h1>

      <span className="text-2xl text-slate-300">/</span>

      <span className="text-xl font-medium text-slate-500">
        Patient Visit
      </span>
    </div>
  </div>


    <span  className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      appointment?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : appointment?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : appointment?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}>
      {appointment?.status}
    </span>
</div>


      </div>

      {/* Main content */}
    {appointment ? (
  <div className="p-8 bg-[#f5f7fb] min-h-screen">
    <div className="grid grid-cols-2 gap-6">

      {/* Left Side */}
      <div className="space-y-6">

        {/* Visit Status */}
        <section className= " rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-6">

          <h3 className="uppercase tracking-[0.18em] text-slate-500 font-semibold text-sm mb-6 flex items-center gap-2">
<Clipboard className="w-5 h-5 text-cyan-400" />            Visit Status
          </h3>

          <div className="flex items-center justify-between mb-6">
            <span   className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      appointment?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : appointment?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : appointment?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `} >
              {appointment?.status}
            </span>

            <div className='flex items-center gap-1 ' >
              <span className="text-sm text-slate-400">
              {appointment.appointment_date}
            </span>
            <span className=' bg-slate-400 w-1 h-1 rounded-full '></span>
            <span className='text-sm text-slate-400'>
              {formatTim(appointment.appointment_time) }
            </span>
            </div>
          </div>

          <div className="space-y-3 text-[15px]">
            <p className="text-slate-500">
              Type :
              <span className="text-slate-800 font-medium ml-2">
                {appointment.type}
              </span>
            </p>

            <p className="text-slate-500">
              Doctor :
              <span className="text-slate-800 font-medium ml-2">
                {appointment.doctors?.profiles?.full_name}
              </span>
            </p>
          </div>

          <div className="flex gap-3 mt-8">


            <button
  disabled={appointment.status === "In Progress"}
  onClick={() => handleStart(appointment.id)}
  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold transition-all duration-300
    ${
      appointment.status === "In Progress"
        ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed"
        : "bg-cyan-500 cursor-pointer hover:bg-cyan-600 active:scale-[0.98] text-white shadow-lg shadow-cyan-100"
    }`}
>
  {appointment.status === "In Progress" ? (
    <>
      <CheckCircle2 size={18} />
      Visit In Progress
    </>
  ) : (
    <>
      <Play size={18} />
      Start Visit
    </>
  )}
</button>

            <button
              onClick={()=>handleCancel(appointment?.id)}
              className="flex-1 rounded-2xl duration-300 cursor-pointer border border-red-200 bg-red-50 hover:bg-red-100 transition-all py-3 text-red-600 font-semibold"
            >
              Cancel Visit
            </button>

          </div>

        </section>

        {/* Patient Information */}
        <section className=" rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-6">

          <h3 className="uppercase tracking-[0.18em] text-slate-500 font-semibold text-sm mb-5">
            Patient Information
          </h3>

       <div className="flex items-center justify-between">

  {/* Left */}
  <div className="flex items-center gap-5">

    {/* Avatar */}
    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-300 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-200/50">
      {appointment.patients?.profiles?.full_name
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>

    {/* Patient Info */}
    <div>

      <h2 className="text-xl font-bold text-slate-800">
        {appointment.patients?.profiles?.full_name}
      </h2>

      <div className="mt-2 space-y-1 text-[15px]">

        <p className="text-slate-500">
          Gender :
          <span className="ml-2 font-medium text-slate-800">
            {appointment.patients?.gender}
          </span>
        </p>

        <p className="text-slate-500">
          DOB :
          <span className="ml-2 font-medium text-slate-800">
            {appointment.patients?.date_of_birth}
          </span>
        </p>

      </div>

    </div>

  </div>

  {/* Booking ID */}
  <div className="text-right">

    <p className="text-xs text-left uppercase tracking-[0.18em] text-slate-400">
      Booking ID:
    </p>

    <div className="mt-2 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-base font-semibold text-slate-700">
      {appointment.booking_id}
    </div>

  </div>

</div>

        </section>

      </div>

      {/* Right Side */}
      <div className="space-y-6">

        <section className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-7">
  <h3 className="uppercase tracking-[0.18em] text-slate-500 font-semibold text-sm mb-5">
    Chief Complaint
  </h3>

  <textarea
    value={chiefComplaint}
    onChange={(e) => setChiefComplaint(e.target.value)}
    className="w-full min-h-[120px] resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 leading-7 outline-none"
    placeholder="Enter chief complaint..."
  />
</section>

        {/* Clinical Notes */}
        <section className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-7">

          <h3 className="uppercase tracking-[0.18em] text-slate-500 font-semibold text-sm mb-5">
            Clinical Notes
          </h3>

          {/* <div className="rounded-2xl border border-slate-200 bg-slate-50 min-h-[180px] p-5 text-slate-700 leading-7">
           
          </div> */}
            <textarea
            value={notes}
            onChange={(e)=>setnotes(e.target.value)}
            className='text-slate-400 rounded-2xl border border-slate-200 bg-slate-50 min-h-[180px] w-full px-5 py-3 text-slate-700  outline-none'  
            placeholder="Enter clinical notes..."/>

        </section>

        {/* Diagnosis */}
        <section className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-7">

          <h3 className="uppercase tracking-[0.18em] text-slate-500 font-semibold text-sm mb-5">
            Diagnosis
          </h3>

        
          <textarea 
          value={diagnosis}
          onChange={(e)=>setdiagnosis(e.target.value)}
          className='rounded-2xl border w-full border-slate-200 bg-slate-50 min-h-[120px] p-5 text-slate-700 leading-7 resize-none outline-none'  
          placeholder='Enter diagnosis...'
          />

        </section>


       <div>
        {
          appointment.status==="In Progress"&&(
<button
onClick={()=>handelCompleted(appointment?.id)}
disabled={!(notes.trim()&&diagnosis.trim()&&chiefComplaint.trim())}
  className="flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 gap-2 cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-4 text-lg font-semibold text-white  shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
>
  <CheckCircle2 size={22} />
  Complete Visit
</button>
          )
        }
       </div>


      </div>

    </div>
  </div>
) : (
  <div className="flex items-center justify-center h-[60vh]">
    <p className="text-slate-400 text-lg">
      No upcoming appointments.
    </p>
  </div>
)}
      </div>
  )
}

export default PatientVisit