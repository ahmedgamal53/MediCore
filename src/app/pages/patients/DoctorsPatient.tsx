import  {  useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useDoctors } from '../../../api/Doctors';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/Authprovider';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../../api/appointments';
import toast from 'react-hot-toast';

const DoctorsPatient = () => {
      const [search, setSearch] = useState("");
      const [selectedSpecialty, setSelectedSpecialty] = useState("All");
      const [selectedDoctor, setSelectedDoctor] = useState<NonNullable<typeof doctors>[number] | null>(null);
      const [showModal, setShowModal] = useState(false);
      const [appointmentDate, setAppointmentDate] = useState("");
      const [appointmentTime, setAppointmentTime] = useState("");
      const [appointment,setappointment]=useState('')
        const [loading, setLoading] = useState(false);
const navigate = useNavigate();


    const {data:doctors}=useDoctors()
    const {session}=useAuth()
      const { data: schedule ,refetch} = useAppointment();


    const check=schedule?.filter((s)=>s.doctor_id===selectedDoctor?.id &&s.appointment_date===appointmentDate)
  

  
   
 
const filterDoctor=doctors?.filter((doctor)=>{
  
    if(selectedSpecialty==="All"){
       return doctor.profiles.full_name.toLowerCase().includes(search.toLowerCase())
    }else{
        return doctor.specialty===selectedSpecialty && doctor.profiles.full_name.toLowerCase().includes(search.toLowerCase())
    }
})


const CloseModel=async()=>{
  setShowModal(false);
            setSelectedDoctor(null);
            setAppointmentDate("");
            setAppointmentTime("");
            setappointment('')
}

const handelConfirm= async()=>{
  setLoading(true)
  try {


  await refetch();
 
    const{error}= await supabase.from('appointments')
    .upsert({
        patient_id:session?.user.id,
        doctor_id:selectedDoctor?.id,
        appointment_date:appointmentDate,
        appointment_time:appointmentTime,
        type:appointment,
        status:'Scheduled'
        
    })
       if(error ){
  toast.error("This appointment has just been booked by another user.");
  setAppointmentTime(""); 
  setLoading(false)
  return;  }

      navigate('/schedule')
  } catch (error) {
    console.log(error);
    
  }finally{
      setShowModal(false);
            setSelectedDoctor(null);
            setAppointmentDate("");
            setAppointmentTime("");
            setappointment('')
            setLoading(false)

            
  }
}


const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  const displayHour =
    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    
  return `${displayHour}:${minute.toString().padStart(2, "0")}`;
};

  if(loading)
        return(
             <div className="fixed inset-0 flex justify-center items-center bg-black/20 ">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
        )
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
          <div className="mx-auto max-w-5xl px-4">
            <div className="py-3 border-b border-b-gray-700">
              <h2 className=" text-2xl font-semibold">Find a Doctor</h2>
              <p className="text-gray-400 text-[15px]">Browse our experienced doctors and book an appointment</p>
            </div>

                <div className="flex mt-5 items-center relative w-[180px] md:w-[450px]">
                              <FaSearch className="text-gray-400 absolute left-3 text-sm" />
                              <input
                                type="search"
                                placeholder="Search doctors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/70 backdrop-blur-md  border-white/30 text-gray-900 placeholder-gray-600 border border-transparent pl-9 pr-3 py-2 outline-none rounded-xl text-sm placeholder-gray-400 transition-all duration-200"
                              />
                            </div>
<div className="flex flex-wrap gap-3 mt-5">
  {["All", ...new Set(doctors?.map((item) => item.specialty))].map(
    (doctor, index) => (
      <button
        key={index}
        onClick={() => setSelectedSpecialty(doctor)}
        className={`px-6 py-3 rounded-2xl cursor-pointer text-sm font-medium transition-all
        ${
          selectedSpecialty === doctor
            ? "bg-white/30 text-[#00C0C1] border "
            : "bg-white/20 text-gray-600 hover:bg-white/30"
        }`}
      >
        {doctor}
      </button>
    )
  )}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-5">
  {filterDoctor?.map((doctor, index) => (
    <div
      key={index}
      className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 flex flex-col items-center text-center"
    >
      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg">
        {doctor?.profiles?.full_name
          ?.split(" ") //Array
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </div>

      {/* Name */}
      <h2 className="text-gray-900 text-3xl font-semibold mt-6">
        {doctor.profiles.full_name}
      </h2>

      {/* Specialty */}
      <h3 className="text-gray-600 font-medium mt-2">
        {doctor.specialty}
      </h3>

      {/* Experience */}
      <p className="text-gray-500 mt-2">
        {doctor.experience} Years
      </p>

      {/* Status */}
      <span
        className={`mt-6 px-4 py-1 rounded-full text-sm font-medium ${
          doctor.currentstatus === "Available"
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : doctor.currentstatus === "Busy"
            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
      >
        {doctor.currentstatus}
      </span>

      {/* Button */}
      <button
        className="w-full cursor-pointer mt-8 bg-white/60   text-[#00C0C1] border hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-2xl font-medium transition-colors"

        onClick={() => {
          setSelectedDoctor(doctor);
          setShowModal(true);
        }}
        disabled={doctor.currentstatus === "Off-Duty"}
      >
        Book Appointment
      </button>
    </div>
  ))}
</div>

{/* Appointment Modal */}
{showModal && selectedDoctor && (
  <div 
       onClick={() => CloseModel()}
          className="fixed inset-0 flex items-center z-50 justify-center bg-black/40"
          
  >
    <div 
    
 onClick={(e) => e.stopPropagation()}
            className="bg-white/30 backdrop-blur-md border border-white/30 p-6 rounded-xl w-xl overflow-y-auto max-h-[80vh]"   >  
                <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-900 text-xl font-semibold">Book Appointment</h2>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() =>CloseModel()}
        >
          ✕
        </button>
      </div>

      {/* Doctor Info */}
      <div className="mb-4 flex items-center gap-5 border border-white/30 rounded-lg px-2 py-2" >
          <div className="w-15 h-15 rounded-full border border-white/30 bg-white/20 flex items-center justify-center text-gray-900 text-2xl font-semibold">
        {selectedDoctor?.profiles?.full_name
          ?.split(" ") //Array
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </div>
  <div className='flex flex-col'>
          <p className="text-gray-900 font-medium">{selectedDoctor.profiles.full_name}</p>
        <p className="text-gray-600">{selectedDoctor.specialty}</p>
        <p className="text-gray-400">{selectedDoctor.experience} Years</p>
  </div>
        <span
          className={`px-2  font-medium ml-auto flex justify-center h-12 rounded-2xl w-fit items-center ${
            selectedDoctor.currentstatus === "Available"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : selectedDoctor.currentstatus === "Busy"
              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {selectedDoctor.currentstatus}
        </span>
      </div>

      {/* Appointment Date */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Appointment Date</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full bg-white/30 backdrop-blur-md border border-white/30 text-gray-900 placeholder-gray-600 border border-transparent rounded-lg p-2 text-white"
        />
      </div>

      {/* Time Slot */}
     {
      appointmentDate&&(
         <div className="mb-4">
  <label className="block text-gray-300 mb-3">Time</label>

  <div className="grid grid-cols-4 gap-3">
    {[
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
    ].map((t) => {
      
      const isBooked = check?.some(
        (a) =>
          a.appointment_date === appointmentDate &&
          a.appointment_time === t
      );
       
        
      return (
        <button
          key={t}
          type="button"
          disabled={isBooked}
          onClick={() => setAppointmentTime(t)}
          className={`p-3 rounded-xl border transition-all font-medium
            ${
              appointmentTime === t
                ? "bg-[#00C0C1] text-white   border-cyan-500"
                : isBooked
                ? "bg-red-900/30 text-red-400 border-red-500 cursor-not-allowed"
                : "bg-white/30 backdrop-blur-md border border-white/30 text-gray-900 placeholder-gray-600 text-white border-gray-700 hover:border-cyan-500"
            }`}
        >
            {formatTime(t)}
        </button>
      );
    })}
  </div>
</div>
      )
     }

      <div className='mb-4'>
      <label className="block text-gray-300 mb-1">Appointment Type</label>
      <select value={appointment}
      onChange={(e)=>setappointment(e.target.value)}
          className="w-full bg-white/30  border  text-gray-600 placeholder-gray-600  border-transparent rounded-lg p-2 "
      >
        <option value="" disabled>Select appointment type</option>
        <option value="check-up">Check-up</option>
        <option value="follow-up">Follow-up</option>
        <option value="consultation">Consultation</option>
        <option value="emergency">Emergency</option>
      </select>
      </div>

  {
    appointment&&appointmentDate&&appointmentTime&&(
         <div className="mb-4 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md p-5">
  <h2 className="mb-4 text-2xl font-bold text-gray-900">
    Booking Summary
  </h2>

  <div className="space-y-2">
    <p className="text-gray-400">
      Doctor:{" "}
      <span className="font-medium text-gray-900">
        {selectedDoctor.profiles.full_name}
      </span>
    </p>

    <p className="text-gray-400">
      Specialty:{" "}
      <span className="font-medium text-gray-900">
        {selectedDoctor.specialty}
      </span>
    </p>

    <p className="text-gray-400">
      Date:{" "}
      <span className="font-medium text-gray-900">
        {appointmentDate}
      </span>
    </p>

    <p className="text-gray-400">
      Time:{" "}
      <span className="font-medium text-gray-900">
        {appointmentTime}
      </span>
    </p>

    <p className="text-gray-400">
      Type:{" "}
      <span className="font-medium text-gray-900">
        {appointment}
      </span>
    </p>
  </div>
</div>
    )
  }

      {/* Confirm Button */}
      <button
        onClick={()=>handelConfirm()}
        disabled={!(appointment && appointmentDate && appointmentTime)}
        className="w-full bg-white/30 border border-white/30 text-gray-900 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded-lg font-medium transition-colors"
      >
        Confirm Appointment
      </button>


    </div>
  </div>
)}
          </div>
          </div>
  )
}

export default DoctorsPatient
