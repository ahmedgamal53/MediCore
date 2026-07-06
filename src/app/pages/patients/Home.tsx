import { IoCalendarClearOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { Calendar } from "lucide-react";
import {  useAppointmentid } from "../../../api/appointments";
import { useDoctors } from "../../../api/Doctors";
import { LuClock3 } from "react-icons/lu";
import { ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Droplets,
  Dumbbell,
  Moon,
  ClipboardCheck,
} from "lucide-react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { supabase } from "../../../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

  const Home = () => {
   const {data: doctors}=useDoctors();
  const navigate = useNavigate();
    const {data: userAppointments}=useAppointmentid();
    const now = new Date();
  const upcoming = userAppointments?.filter((a:any) => a.status !=='Cancelled'&&a.status !=='completed' && new Date(`${a.appointment_date}T${a.appointment_time}` ) >= now ).sort((a:any,b:any)=>
{
  if (a.appointment_date !== b.appointment_date) {
      return a.appointment_date.localeCompare(b.appointment_date);
    }

    return a.appointment_time.localeCompare(b.appointment_time);
}
  );
console.log('session',upcoming);

  const formatTime=(time:string)=>{
    const [hour,minute]=time.split(':').map(Number)

    const displayHour= 
    hour===0?12:hour>12?hour-12:hour

    return `${displayHour}:${minute.toString().padStart(2,'0')}`
  }
    
const queryClient=useQueryClient()
  const handelcansel=async(id:string)=>{
try {
  const {error}=await supabase 
  .from('appointments')
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
  }


  const tips = [
  {
    title: "Stay hydrated",
    description:
      "Drink at least 8 glasses of water daily to support circulation and energy levels.",
    icon: Droplets,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  {
    title: "Move daily",
    description:
      "Aim for 30 minutes of moderate exercise most days to keep your heart strong.",
    icon: Dumbbell,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    title: "Prioritize sleep",
    description:
      "Adults need 7–9 hours of quality sleep each night for recovery and focus.",
    icon: Moon,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  {
    title: "Annual checkup",
    description:
      "Schedule your yearly physical to catch potential issues early.",
    icon: ClipboardCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
];
  
  return (
     <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen py-3">
            <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-gray-900 text-4xl font-bold">Welcome Back</h2>
        <p className="text-gray-400 text-lg">Manage your healthcare appointments and records</p>
        <div className=" grid grid-cols-1 md:grid-cols-2  gap-6 mt-8 mr-2">

<div className="flex justify-between items-center bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8  transition-shadow">     
       <div>
            <h3 className="text-2xl font-semibold text-gray-900">Total Appointments</h3>
            <span className="text-4xl font-bold text-[#00C0C1]">{userAppointments?.filter((a)=>a.status !=='Cancelled'&&a.status !=='completed').length ?? 0}</span>
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
          {upcoming && upcoming[0] ? (
        
            <div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E0D6] to-[#00A39C] flex items-center justify-center text-white font-semibold text-lg">
                {upcoming[0]?.doctors?.profiles?.full_name?.split(' ')?.map((n:string)=>n[0])?.join('').slice(0,2)}
              </div>
              <div>
                  <h3 className=" text-2xl font-semibold">{upcoming[0]?.doctors?.profiles?.full_name}</h3>
                <p className="text-[#00A39C] mb-2">{upcoming[0]?.doctors?.specialty}</p>
                </div>
                </div>
              <div>
                 <div className="inline-flex items-center gap-3 border border-cyan-800 rounded-full px-5 py-2 bg-cyan-950/20 mt-2">
                   <span className="text-gray-400 uppercase">Booking ID</span>
                  <span className="text-[#00A39C] font-semibold">{upcoming[0]?.booking_id}</span>
                 </div>
              </div>

            </div>
            <div className="flex  mt-2  justify-center gap-6">
                {/* Date */}
                 <div className="flex items-center gap-3 t text-lg">
                   <Calendar size={20} className="text-gray-400" />
                   <span>{upcoming[0]?.appointment_date}</span>
                 </div>
                 {/* Time */}
                 <div className="flex items-center gap-3  text-lg mt-1">
                   <LuClock3 size={20} className="text-gray-400" />
                   <span>{formatTime(upcoming[0]?.appointment_time)}</span>
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
                     onClick={() => handelcansel(upcoming[0]?.id)}
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


        {/* swiper */}

<div className="my-5">
           <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
      
      slidesPerView={1}
      autoplay={{
        delay:3000,
         disableOnInteraction: false,
    pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}

    >
   {tips.map((tip) => {
  const Icon = tip.icon;

  return (
    <SwiperSlide
      key={tip.title}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 px-12 py-10"
    >
      {/* Blur decoration */}
      <div className="absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full items-center justify-between">
        {/* Left */}
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Daily Wellness
          </span>

          <h2 className="mt-3 text-4xl font-bold text-white">
            Health Tip of the Day
          </h2>

          <h3 className="mt-8 text-3xl font-semibold text-white">
            {tip.title}
          </h3>

          <p className="mt-4 text-lg leading-8 text-slate-300">
            {tip.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center gap-6">
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-[32px] border ${tip.border} ${tip.bg} shadow-2xl backdrop-blur-xl`}
          >
            <Icon
              size={54}
              className={tip.color}
              strokeWidth={2}
            />
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2">
            <span className="text-sm font-medium text-slate-300">
              Healthy Habit
            </span>
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
})}
    </Swiper>
</div>
        {/* swiper */}

        <div className="rounded-[32px] max-h-[450px] overflow-y-auto bg-white/90 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(15,23,42,.08)] px-4 ">
          <div className="flex sticky  top-0 -mx-4  px-4 mb-4 py-3 z-50 bg-white/90 backdrop-blur-2xl border  border-white justify-between items-center ">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <button
            className="cursor-pointer flex items-center justify-center text-[#00A39C]"
            onClick={()=>navigate('/schedule')}>View Schedule <ChevronRight /></button>
          </div>
            <div>
             {upcoming?.map((coming) => (
    <div
      key={coming.id}
      className="mb-3 flex items-center justify-between rounded-[26px] border border-[#08C4D8]/15 bg-white/80 backdrop-blur-xl px-6 py-5 shadow-[0_8px_30px_rgba(8,196,216,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#08C4D8]/30 hover:shadow-[0_18px_45px_rgba(8,196,216,0.15)]"
    >
      <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E0D6] to-[#00A39C] flex items-center justify-center text-white font-semibold text-lg">
          {coming.doctors?.profiles?.full_name
            ?.split(" ")
            ?.map((n: string) => n[0])
            ?.join("")
            ?.slice(0, 2)}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-[#0891B2]">
            {coming.doctors?.profiles?.full_name}
          </h3>

<p className="mt-1 text-[15px] font-semibold text-[#00A39C]">            {coming.doctors?.specialty}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C4D8]/10">
            <Calendar size={18} className="text-[#08C4D8]" />
          </div>

          <span className="font-medium text-slate-700">
            {coming.appointment_date}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C4D8]/10">
            <LuClock3 size={18} className="text-[#08C4D8]" />
          </div>

          <span className="font-medium text-slate-700">
            {formatTime(coming.appointment_time)}
          </span>
        </div>
      </div>
    </div>
  ))}
            </div>
        </div>
    </div>
    </div>
  )
}

export default Home