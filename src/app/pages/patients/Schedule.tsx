import { useAppointmentid } from '../../../api/appointments';
import { RingLoader } from 'react-spinners';
import { Calendar, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { LuClock3 } from 'react-icons/lu';
import { supabase } from '../../../supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

const SchedulePatient = () => {
  const navigate = useNavigate();
  const { data: schedule, isLoading, error } = useAppointmentid();

  const formatTime = (time: string ) => {
    if (!time) return "--:--";
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")}`;
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <RingLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <p className="text-red-500 mb-2">Error loading appointments</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient=useQueryClient()
  const handelcansel=async(appointmentId: string)=>{
    

    try {
      const {error}=await supabase.from('appointments')
      .update({
        status:'Cancelled'
      })
      .eq('id',appointmentId)
      if(error){
toast.error("Failed to cancel the appointment.")
return;     
 }

       toast.success("Canseled successfully")
       queryClient.invalidateQueries({queryKey: ["appointments"]})
    } catch (error) {
      console.log(error);
      
    }
  }

  const appointments = schedule?.filter((a)=>a.status !=='Cancelled') ?? [];

  console.log('appointments',appointments);
  
  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <div className="flex items-center  bg-white shadow-sm px-4 py-3">
        <ChevronLeft
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">
          My Schedule
        </h1>
        <div className="w-6 h-6" />
      </div>

      <div className="max-w-5xl mx-auto p-4">
        <div className="py-3 border-b border-gray-200 mb-4">
          <h2 className="text-gray-900 text-2xl font-semibold">My Appointments</h2>
          <p className="text-gray-500 text-sm">
            View and manage all your medical appointments
          </p>
        </div>

        
        {appointments.length === 0  ? (
          <p className="text-gray-500 mt-4 text-center">No upcoming appointments.</p>
        ) : (
          <div className=" grid lg:grid-cols-2 gap-4">
            
            {appointments.map((appointment: any) => {
              const initials =
                appointment?.doctors?.profiles?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2);

              return (

               <div>
 <div
                  key={appointment.id}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[26px] p-6 shadow-sm"
                >
                  {/* Header – avatar, doctor name, specialty */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E0D6] to-[#00A39C] flex items-center justify-center text-white font-semibold text-lg">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-gray-800 text-xl font-bold">
                          {appointment?.doctors?.profiles?.full_name}
                        </h3>
                        <p className="text-[#00A39C] mt-1 text-sm">
                          {appointment?.doctors?.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 border border-cyan-300 rounded-full px-3 py-1 bg-cyan-50">
                      <span className="text-xs uppercase text-cyan-800">Booking ID</span>
                      <span className="text-sm font-medium text-cyan-800">{appointment?.booking_id}</span>
                    </div>
                  </div>

                  
                  <div className="border-t border-gray-200 my-4" />

                  
                  <div className="space-y-2">

                    <div className='flex justify-between items-start'>

                <div className='flex flex-col gap-2'>
                      <div className="flex items-center gap-2 text-gray-600">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C4D8]/10">
            <Calendar size={18} className="text-[#08C4D8]" />
          </div>   

             <span className='font-medium text-slate-700'>{appointment?.appointment_date}</span>
                    </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C4D8]/10">
                                  <LuClock3 size={18} className="text-[#08C4D8]" />
                                </div>
                      <span className='font-medium text-slate-700'>{formatTime(appointment?.appointment_time)}</span>
                    </div>
                </div>
                    <div className='flex flex-col gap-3'>
                      <span className="inline-block mt-3 px-2 py-0.5 rounded-full border border-gray-300 text-xs text-gray-600">
                      {appointment?.type}
                    </span>
                    <span 
                      className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      appointment?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : appointment?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : appointment?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `} 
                    >
                      {appointment?.status}
                    </span>
                    </div>


                  </div>
                  </div>

                  
                  

                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handelcansel(appointment?.id)}
                      className="text-red-500 cursor-pointer hover:underline text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                  
                
               </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePatient;
