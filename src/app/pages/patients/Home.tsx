import { IoCalendarClearOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { Calendar } from "lucide-react";
import { useAppointment, useAppointmentid, useDeleteAppointment } from "../../../api/appointments";
import { useDoctors } from "../../../api/Doctors";
import { LuClock3 } from "react-icons/lu";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
  const Home = () => {
  const {data: appointment}=useAppointment();
   const {data: doctors}=useDoctors();
  const {mutate: deleteAppointment} = useDeleteAppointment();
  const navigate = useNavigate();
    const {data: userAppointments}=useAppointmentid();
    const now = new Date();
  const upcoming = userAppointments?.filter((a:any) => new Date(a.appointment_date) >= now).sort((a,b)=>(a.appointment_date)-(b.appointment_time));


    const NextAppointment = userAppointments
    ? userAppointments
        .filter((a: any) => new Date(a.appointment_date) >= now)
        .sort(
          (a: any, b: any) =>
            new Date(a.appointment_date).getTime() -
            new Date(b.appointment_date).getTime()
        )
    : [];
  console.log('NextAppointment', NextAppointment[0]);
  
  return (
     <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen py-3">
            <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-gray-900 text-4xl font-bold">Welcome Back</h2>
        <p className="text-gray-400 text-lg">Manage your healthcare appointments and records</p>
        <div className=" grid grid-cols-1 md:grid-cols-2  gap-6 mt-8 mr-2">

<div className="flex justify-between items-center bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8  transition-shadow">     
       <div>
            <h3 className="text-2xl font-semibold text-gray-900">Total Appointments</h3>
            <span className="text-4xl font-bold text-[#00C0C1]">{appointment?.length ?? 0}</span>
          </div>
          <IoCalendarClearOutline className="text-4xl text-[#00C0C1]"/>
        </div>

        <div className="flex justify-between items-center bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8  transition-shadow">
  <div>
    <h3 className="text-2xl font-semibold text-gray-900">Available Doctors</h3>
    <span className="text-4xl font-bold text-[#00C0C1]">{doctors?.filter(d => d.currentstatus === "Available")?.length ?? 0}</span>
  </div>
  <FiUsers className="text-4xl text-[#00C0C1]"/>
</div>
        <div className="flex justify-between items-center bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8 transition-shadow">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Upcoming Appointments</h3>
            <span className="text-4xl font-bold text-[#00C0C1]">{upcoming?.length ?? 0}</span>
          </div>
          <LuClock3 className="text-4xl text-[#00C0C1]"/>
        </div>
        </div>

         <div className="my-5  bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8  transition-shadow">
           <h3 className="text-2xl font-semibold mb-4">Next Appointment</h3>
          {NextAppointment && NextAppointment[0] ? (
        
            <div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-full border-2 border-cyan-700 bg-cyan-900/20 flex items-center justify-center text-cyan-400 text-xl font-semibold">
                {NextAppointment[0]?.doctors?.profiles?.full_name?.split(' ')?.map((n:string)=>n[0])?.join('').slice(0,2)}
              </div>
              <div>
                  <h3 className=" text-2xl font-semibold">{NextAppointment[0]?.doctors?.profiles?.full_name}</h3>
                <p className="text-cyan-400 mb-2">{NextAppointment[0]?.doctors?.specialty}</p>
                </div>
                </div>
              <div>
                 <div className="inline-flex items-center gap-3 border border-cyan-800 rounded-full px-5 py-2 bg-cyan-950/20 mt-2">
                   <span className="text-gray-400 uppercase">Booking ID</span>
                  <span className="text-cyan-400 font-semibold">{NextAppointment[0]?.booking_id}</span>
                 </div>
              </div>

            </div>
            <div className="flex  mt-2  justify-center gap-6">
                {/* Date */}
                 <div className="flex items-center gap-3 t text-lg">
                   <Calendar size={20} className="text-gray-400" />
                   <span>{NextAppointment[0]?.appointment_date}</span>
                 </div>
                 {/* Time */}
                 <div className="flex items-center gap-3  text-lg mt-1">
                   <LuClock3 size={20} className="text-gray-400" />
                   <span>{NextAppointment[0]?.appointment_time}</span>
                 </div>
            </div>

             <div className="flex  gap-4 mt-4">
                   <button
                     onClick={() => navigate('/schedule')}
                     className="px-4 flex-1 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-700 transition"
                   >
                     Details
                   </button>
                   <button
                     onClick={() => deleteAppointment(NextAppointment[0]?.id, {
                       onSuccess: () => { toast.success('Appointment cancelled'); },
                       onError: (error:any) => { toast.error(error.message); }
                     })}
                     className="px-4 flex-1 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition"
                   >
                     Cancel
                   </button>
                 </div>
            </div>
          ) : (
            <p className="text-gray-400">No upcoming appointments.</p>
          )}
        </div>
    </div>
    </div>
  )
}

export default Home