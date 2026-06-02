import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoArrowBackCircle } from "react-icons/io5";
import { usePatientDetails } from "../../../api/Patients";
import { RingLoader } from "react-spinners";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatientDetails(id ?? "");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
  };

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
    <div className="bg-[#070E16] min-h-screen p-6 text-white">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-2xl cursor-pointer text-[#00D9D9]">
        <IoArrowBackCircle className="mr-1" /> Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Patient Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Full Name</div>
          <div className="text-white text-lg">{profile.full_name || "-"}</div>
        </div>
      
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Phone</div>
          <div className="text-white text-lg">{patient.phone || "-"}</div>
        </div>
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Date of Birth</div>
          <div className="text-white text-lg">{formatDate(patient.date_of_birth)}</div>
        </div>
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Gender</div>
          <div className="text-white text-lg">{patient.gender || "-"}</div>
        </div>
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Blood Type</div>
          <div className="text-white text-lg">{patient.Blood_Type || "-"}</div>
        </div>
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Account Status</div>
          <div className="text-white text-lg">{profile.status || "-"}</div>
        </div>
        <div className="bg-[#0F171F] rounded-xl p-4">
          <div className="text-gray-400 text-sm">Role</div>
          <div className="text-white text-lg">{profile.role || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
