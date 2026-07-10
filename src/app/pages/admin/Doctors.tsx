import { useState, type ChangeEvent, type FormEvent, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { FaSearch } from "react-icons/fa"
import { CiFilter } from "react-icons/ci";
import { MdPersonAddAlt } from "react-icons/md";
import { IoKeyOutline, IoPersonOutline } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { supabase } from "../../../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDeleteDoctor, useDoctors } from "../../../api/Doctors";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);

const {data:doctors,isLoading}=useDoctors()
const navigate=useNavigate()
const{mutate:deleteDoctor}=useDeleteDoctor()
  // State for search input
  const [search, setSearch] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [selecteddoctor, setselecteddoctor] = useState(null);
  // State to control Add Doctor modal visibility
  const [showAddModal, setShowAddModal] = useState(false);

  // State to hold new doctor form data
  const [newDoctor, setNewDoctor] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "",
    experience: 0,
    currentstatus: "Available",
        role: "doctor",
  });


    const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setNewDoctor((prev) => ({ ...prev, [name]: value }));
    };
  // Open modal handler
  const openAddModal = () => {
    setShowAddModal(true);
    setIsEditing(false)
    setNewDoctor({
    fullName: "",
    email: "",
    phone: "",
    specialty: "",
    experience: 0,
    currentstatus: "Available",
        role: "doctor",
    })
  };


const handleEdit=(doctor)=>{
  setIsEditing(true)
  setselecteddoctor(doctor)
  setShowAddModal(true)
  setNewDoctor({
    fullName:doctor.profiles?.full_name,
    phone:doctor.phone,
    specialty:doctor.specialty,
    experience:doctor.experience,
    currentstatus:doctor.currentstatus,
    role:"doctor",
    email:doctor.profiles?.email
  })
}

  
  // Close modal handler (used for Cancel)
  const closeAddModal = () => {
    setShowAddModal(false);
    // Reset form fields
    setNewDoctor({
      fullName: "",
      email: "",
      phone: "",
      specialty: "",
      experience: 0,
      currentstatus: "Available",
              role: "doctor",
    });
  };

  const queryClient=useQueryClient()

  // Save new doctor handler (placeholder – replace with actual save logic)
  const saveDoctor = async (e: FormEvent)  => {
    e.preventDefault();

  setLoading(true);

  try {
    const {  error } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
          email: newDoctor.email,
          password: newDoctor.phone,
          full_name: newDoctor.fullName,
          phone: newDoctor.phone,
          role: newDoctor.role,
          currentstatus: newDoctor.currentstatus,
          specialty: newDoctor.specialty,
          experience: newDoctor.experience,
        },
      }
    );
  if (error) {
  alert(error.message);
  return;
} else {
toast.success("Doctor Created Successfully");}

const {error:activityError }=await supabase
.from("recent_activity")
.insert({
  doctor_name:newDoctor.fullName,
  
type: "doctor_created",
title:"New Doctor added",
description:`${newDoctor.fullName} `

})
if (activityError) {
  console.error(activityError);
}
    await queryClient.invalidateQueries({queryKey:['doctors']})
    await queryClient.invalidateQueries({queryKey:['profiles']})

    closeAddModal();

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
  }

  // Edite 

  const EditeDoctor= async(e:FormEvent)=>{
e.preventDefault()
setLoading(true)

try {
  
const {error}=await supabase 
.from('doctors')
.update({
  specialty:newDoctor.specialty,
  experience:newDoctor.experience,
  phone:newDoctor.phone,
  currentstatus:newDoctor.currentstatus
})
.eq('id',selecteddoctor?.id)
if(error)throw error


    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: newDoctor.fullName,
      })
      .eq("id", selecteddoctor.id);

    if (profileError) throw profileError;
        toast.success("Doctor Updated Successfully")

            await queryClient.invalidateQueries({queryKey:['doctors']})
            await queryClient.invalidateQueries({queryKey:['profiles']})
            closeAddModal()
} catch (error) {
  console.log(error);
  
}finally{
      setLoading(false);

}
  }



  const filterPatients = doctors?.filter((doctor) => {
  if (status === "All") {
    return  doctor?.profiles?.full_name.toLowerCase().includes(search.toLowerCase()); 
   }else{
    return doctor?.currentstatus === String(status) && doctor.profiles?.full_name.toLowerCase().includes(search.toLowerCase())
   }
});



  return (
       <div className="bg-[#F6F8FC] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="pb-6 mb-6 border-b border-slate-200">
              <h2 className="text-slate-900 text-3xl font-bold">Doctors</h2>
              <p className="text-slate-500 text-[15px] mt-1">Manage medical staff</p>
            </div>
            {/* Search and add patient */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center relative w-[220px] md:w-[420px]">
                  <FaSearch className="text-slate-400 absolute left-4 text-sm" />
                  <input
                    type="search"
                    placeholder="Search doctors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 outline-none rounded-2xl text-sm text-slate-900 placeholder-slate-400 shadow-sm  transition-all duration-200"
                  />
                </div>
                <CiFilter className="text-slate-500 text-2xl" />
                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 w-full p-3 text-slate-700 rounded-2xl outline-none   transition-all"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Off-Duty">Off-Duty</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={openAddModal}
                >
                  Add Doctor
                </button>
              </div>
            </div>


          </div>
      
    {/* Add Doctor Modal */}
    {showAddModal && (
 <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 flex items-center z-50 justify-center bg-black/25 backdrop-blur-md p-4"
        >     
 <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 p-8 rounded-[30px] w-xl shadow-[0_25px_80px_rgba(15,23,42,.12)] max-h-[90vh] overflow-y-auto"          > 
  <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-3 py-3 rounded-2xl text-xl shadow-md">
                <MdPersonAddAlt />
              </div>
              <h3 className="text-slate-900 text-xl font-semibold">Add Doctor</h3>
            </div>   
             <p className="mb-4 text-slate-500 border-b border-slate-200 pb-4">
              Create a doctor profile and assign specialties
            </p>
       <form onSubmit={isEditing?EditeDoctor:saveDoctor} className="space-y-4">
                   {/* Basic Information */}
                     <div className="flex items-center gap-2 mb-4">
                       <div className="text-emerald-600">
                         <IoPersonOutline />
                       </div>
                       <h3 className="text-slate-900 font-semibold">Basic Information</h3>
                     </div>
     
                     <div className="grid grid-cols-2 gap-4">
                     {/* Full Name */}
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">
                         Full Name
                       </label>
                       <input
                         name="fullName"
                         required
                         placeholder="Full Name"
                         value={newDoctor.fullName}
                         onChange={handleInputChange}
                         
                         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none     transition-all"
                       />
                     </div>
     
                     {/* Email Address */}
      {
        !isEditing&&(
           <div>
         <label className="block text-sm font-medium text-slate-600 mb-1">
           Email Address
         </label>
         <input
         
           name="email"
           placeholder="Email Address"
           type="email"
           value={newDoctor.email}
           onChange={handleInputChange}
           required
           className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none     transition-all"
         />
       </div>
        )
      }
     
     
                     {/* Phone Number */}
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">
                         Phone Number
                       </label>
                       <input
                         name="phone"
                         placeholder="Phone Number"
                         value={newDoctor.phone}
                         required
                         onChange={handleInputChange}
                         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none     transition-all"
                       />
                     </div>
                     {/*Specialty   */}
                      <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">
                         Specialty
                       </label>
                      <select name="specialty"
                       value={newDoctor.specialty}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none     transition-all"
                      >
                        <option value="" disabled>Select Specialty</option>
                        
  <option value="Cardiology">Cardiology</option>
  <option value="Neurology">Neurology</option>
  <option value="Pediatrics">Pediatrics</option>
  <option value="Orthopedics">Orthopedics</option>
  <option value="Internal Medicine">Internal Medicine</option>
  <option value="General Surgery">General Surgery</option>
  <option value="Dermatology">Dermatology</option>
  <option value="Psychiatry">Psychiatry</option>
  <option value="ENT">ENT</option>
  <option value="Ophthalmology">Ophthalmology</option>
                      </select>
                     </div>


                          <div className="flex col-span-2 items-center gap-2 border-t border-slate-200 pt-4">
                       <div className="text-emerald-600">
                         <LuBriefcaseBusiness />
                       </div>
                       <h3 className="text-slate-900 font-semibold">Professional Information</h3>
                     </div>

               <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">
                         Experience (Years)
                       </label>
                       <input
                       name="experience"
                       type="number"
                         value={newDoctor.experience}
                         onChange={handleInputChange}
                         required
                         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none     transition-all"
                       />
                     </div>

                        <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">
                         Current Status
                       </label>
                       <select name="currentstatus"
                       required
                        value={newDoctor.currentstatus}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none     transition-all">
                          <option value="Available">Available</option>
                          <option value="Busy">Busy</option>
                    <option value="Off-Duty">Off-Duty</option>
                        </select>
                     </div>

                                {/*Account Information  */}

                   <div className="flex items-center gap-2 col-span-2 mt-2 pt-4 border-t border-slate-200">                   
                        <IoKeyOutline className="text-emerald-600"/>
                     <h3 className="text-slate-900 font-semibold">
                        Account Information
                    </h3>
                   </div>
                    <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Role
                  </label>
                 <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none">
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">doctor</span>
                </div>
                </div>

                <div>
                <label  className="block text-sm font-medium text-slate-600 mb-1">Temporary Password</label>              
                <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
  <span>{newDoctor.phone}</span>
  <span className="text-slate-400 ml-2">(Phone number)</span>
              </div>
                </div>
                </div>

                       <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeAddModal}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Cancel
            </button>
            <button
            type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {loading?isEditing?'Edting Doctor...':'Creating Doctor...'
            :isEditing?'Edite Doctor' :'Create Doctor'  
            }
            </button>
          </div>
                     </form>
        
        </div>
       
      </div>
    )}


    
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
  {isLoading ? (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,.06)] p-6 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-14 rounded-2xl bg-slate-100 animate-pulse"
        />
      ))}
    </div>
  ) : doctors && doctors.length > 0 ? (
    <div className="max-h-[500px] rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,.06)] overflow-y-auto">
      <table className="w-full text-slate-500">
        <thead className="bg-slate-50 sticky top-0 z-5 text-slate-500">
          <tr>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Patient
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Specialty
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Contact
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Experience
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Edit
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Delete
            </th>
          </tr>
        </thead>

        <tbody>
          {(filterPatients?.length ?? 0) > 0 ? (
            filterPatients?.map((doctor) => (
              <tr
                key={doctor.id}
                className="border-t border-slate-100 text-center transition"
              >
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span
                      onClick={() => navigate(`/doctors/${doctor.id}`)}
                      className="text-slate-900 font-medium cursor-pointer hover:text-emerald-700 transition-all duration-300"
                    >
                      {doctor.profiles.full_name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-emerald-600 font-medium">
                  {doctor.specialty}
                </td>

                <td className="px-4 py-4">{doctor.phone}</td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-[12px] ${
                      doctor.currentstatus === "Available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : doctor.currentstatus === "Busy"
                        ? "bg-teal-50 text-teal-700 border border-teal-100"
                        : doctor.currentstatus === "Off-Duty"
                        ? "bg-slate-100 text-slate-500 border border-slate-200"
                        : ""
                    }`}
                  >
                    {doctor.currentstatus}
                  </span>
                </td>

                <td className="px-4 py-4">{doctor.experience}</td>

                <td className="px-4 py-4">
                  <span
                    onClick={() => handleEdit(doctor)}
                    className="cursor-pointer text-emerald-600 font-medium hover:text-emerald-700 transition-all duration-300"
                  >
                    Edit
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    onClick={() => deleteDoctor(doctor.id)}
                    className="cursor-pointer bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-100 transition-all duration-300"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-slate-500"
              >
                No Doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex justify-center items-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
      No patients found
    </div>
  )}
</div>
    </div>
  )
}

export default Doctors