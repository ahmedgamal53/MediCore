import {  useAppointmentid, useDeleteAppointment } from '../../../api/appointments';
import { RingLoader } from 'react-spinners';
import { Calendar, Clock } from "lucide-react";
import toast from 'react-hot-toast';
const SchedulePatient = () => {
    const { data: schedule, isLoading, error } = useAppointmentid();
const {mutate:deleteschedule}=useDeleteAppointment()
  

 

      if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#070E16]">
                <RingLoader color="#3b82f6" size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 bg-[#070E16] min-h-screen p-5">
                Error loading appointments: {error.message}
            </div>
        );
    }

    const appointments = schedule ?? [];

    return (
        <div className="bg-[#070E16] min-h-screen">
            <div className="ml-5">
                <div className="py-3 border-b border-b-gray-700">
                    <h2 className="text-white text-2xl font-semibold">My Appointments</h2>
                    <p className="text-gray-400 text-[15px]">
                        View and manage all your medical appointments
                    </p>
                </div>
                <h3 className='text-white text-xl font-semibold mt-2'>Upcoming Appointments</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-400 mt-4">No upcoming appointments.</p>
                ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 px-5">
  {appointments?.map((appointment: any) => {
    const initials =
      appointment?.doctors?.profiles?.full_name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 3) || "DR";

    return (
      <div
        key={appointment.id}
        className="bg-[#020c1b] border border-cyan-800 rounded-3xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-700 bg-cyan-900/20 flex items-center justify-center text-cyan-400 text-xl font-semibold">
              {initials}
            </div>

            <div>
              <h2 className="text-white text-3xl font-bold">
                {appointment?.doctors?.profiles?.full_name}
              </h2>

              <p className="text-cyan-400 mt-2">
                {appointment?.doctors?.specialty}
              </p>
            </div>
          </div>

        
              <div className="">
          <div className="inline-flex items-center gap-3 border border-cyan-800 rounded-full px-5 py-3 bg-cyan-950/20">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-400 uppercase">
              Booking ID
            </span>
            <span className="text-cyan-400 font-semibold">
              {appointment?.booking_id}
            </span>
          </div>
        </div>
        </div>

 

        <div className="border-t border-slate-800 my-8" />

        {/* Date & Time */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-white text-xl">
  <Calendar size={20} className="text-gray-400" />         
     <span>{appointment?.appointment_date}</span>
          </div>

          <div className="flex items-center gap-3 text-white text-xl">
 <Clock size={20} className="text-gray-400" />        
     <span>{appointment?.appointment_time}</span>
          </div>

          <span className="inline-block px-3 py-1 rounded-lg border border-slate-700 text-gray-400">
            {appointment?.type}
          </span>
        </div>

       

        <div className="border-t border-slate-800 my-8" />

        {/* Actions */}
        <div className="text-center">
          

          <button
            onClick={ () => {
    
       deleteschedule(appointment.id,{
        onSuccess:()=>{
          toast.success("Deleted successfully");
        },
        onError:(error)=>{
          toast.error(error.message);
        }
       })
      
     
  }}
          className="border border-red-700 px-15 cursor-pointer rounded-xl py-3 text-red-400 hover:bg-red-950/20 transition">
            Cancel
          </button>
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