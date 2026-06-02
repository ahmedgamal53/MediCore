import { useNavigate, useParams } from 'react-router-dom'
import { useDoctorsDetails } from '../../../api/Doctors'
import { RingLoader } from 'react-spinners'
import { IoArrowBackCircle } from 'react-icons/io5'

const DoctorID = () => {
const { id } = useParams<{ id: string }>();  
  const {data:doctor,isLoading}=useDoctorsDetails(id)
  const navigate = useNavigate();

      if (isLoading) {
   return(
             <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
        )  }

          const profile = doctor?.profiles || {};

  return (
       <div className="bg-[#070E16] min-h-screen p-6 text-white">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-2xl cursor-pointer text-[#00D9D9]">
            <IoArrowBackCircle className="mr-1" /> Back
          </button>
          <h2 className="text-2xl font-semibold mb-4">doctor Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Full Name</div>
              <div className="text-white text-lg">{profile.full_name || "-"}</div>
            </div>
          
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Phone</div>
              <div className="text-white text-lg">{doctor?.phone || "-"}</div>
            </div>
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Experience</div>
              <div className="text-white text-lg">{doctor?.experience}</div>
            </div>
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Specialty</div>
              <div className="text-white text-lg">{doctor?.specialty || "-"}</div>
            </div>
         
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Account Status</div>
              <div className="text-white text-lg">{doctor?.currentstatus || "-"}</div>
            </div>
            <div className="bg-[#0F171F] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Role</div>
              <div className="text-white text-lg">{profile.role || "-"}</div>
            </div>
          </div>
        </div>
  )
}

export default DoctorID