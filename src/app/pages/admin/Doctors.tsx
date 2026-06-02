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

const {data:doctors}=useDoctors()
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
.eq('id',selecteddoctor.id)
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
        <div className="bg-[#070E16] h-screen">
          <div className="ml-5">
            <div className="py-3 border-b border-b-gray-700">
              <h2 className="text-white text-2xl font-semibold">Doctors</h2>
              <p className="text-gray-400 text-[15px]">Manage medical staff</p>
            </div>
            {/* Search and add patient */}
            <div className="flex justify-between items-center">
              <div className="py-3 flex items-center gap-3">
                <div className="flex items-center relative w-[180px] md:w-[450px]">
                  <FaSearch className="text-gray-400 absolute left-3 text-sm" />
                  <input
                    type="search"
                    placeholder="Search doctors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#191e24c5] border border-transparent pl-9 pr-3 py-2 outline-none rounded-xl text-sm text-white placeholder-gray-400 transition-all duration-200"
                  />
                </div>
                <CiFilter className="text-white text-2xl" />
                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-[#0F171F] w-full p-3 text-white rounded-xl outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Off-Duty">Off-Duty</option>
                  </select>
                </div>
              </div>
              <div className="mr-10">
                <button
                  className="bg-[#00C0C1] px-2 py-3 rounded-xl cursor-pointer"
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
          className="fixed inset-0 flex items-center z-50 justify-center bg-black/40"
        >     
 <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F171F] border-2 border-[#1F2847] p-6 rounded-xl w-xl "          > 
  <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#18203F] text-[#00D9D9] px-2 py-2 rounded-xl text-xl">
                <MdPersonAddAlt />
              </div>
              <h3 className="text-white text-xl">Add Doctor</h3>
            </div>   
             <p className="mb-3 text-[#999999] border-b border-gray-600 py-2">
              Create a doctor profile and assign specialties
            </p>
       <form onSubmit={isEditing?EditeDoctor:saveDoctor} className="space-y-4">
                   {/* Basic Information */}
                     <div className="flex items-center gap-2  mb-4">
                       <div className="text-[#00D9D9]  ">
                         <IoPersonOutline />
                       </div>
                       <h3 className="text-[#F3F3F3]">Basic Information</h3>
                     </div>
     
                     <div className="grid grid-cols-2 gap-4">
                     {/* Full Name */}
                     <div>
                       <label className="block text-sm font-medium text-gray-400 mb-1">
                         Full Name
                       </label>
                       <input
                         name="fullName"
                         required
                         placeholder="Full Name"
                         value={newDoctor.fullName}
                         onChange={handleInputChange}
                         
                         className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
                       />
                     </div>
     
                     {/* Email Address */}
      {
        !isEditing&&(
           <div>
         <label className="block text-sm font-medium text-gray-400 mb-1">
           Email Address
         </label>
         <input
         
           name="email"
           placeholder="Email Address"
           type="email"
           value={newDoctor.email}
           onChange={handleInputChange}
           required
           className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
         />
       </div>
        )
      }
     
     
                     {/* Phone Number */}
                     <div>
                       <label className="block text-sm font-medium text-gray-400 mb-1">
                         Phone Number
                       </label>
                       <input
                         name="phone"
                         placeholder="Phone Number"
                         value={newDoctor.phone}
                         required
                         onChange={handleInputChange}
                         className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
                       />
                     </div>
                     {/*Specialty   */}
                      <div>
                       <label className="block text-sm font-medium text-gray-400 mb-1">
                         Specialty
                       </label>
                      <select name="specialty"
                       value={newDoctor.specialty}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white  "
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


                          <div className="flex col-span-2  items-center gap-2  border-t border-gray-600 pt-2 ">
                       <div className="text-[#00D9D9]  ">
                         <LuBriefcaseBusiness />
                       </div>
                       <h3 className="text-[#F3F3F3]">Professional Information</h3>
                     </div>

               <div>
                       <label className="block text-sm font-medium text-gray-400 mb-1">
                         Experience (Years)
                       </label>
                       <input
                       name="experience"
                       type="number"
                         value={newDoctor.experience}
                         onChange={handleInputChange}
                         required
                         className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
                       />
                     </div>

                        <div>
                       <label className="block text-sm font-medium text-gray-400 mb-1">
                         Current Status
                       </label>
                       <select name="currentstatus"
                       required
                        value={newDoctor.currentstatus}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white  ">
                          <option value="Available">Available</option>
                          <option value="Busy">Busy</option>
                    <option value="Off-Duty">Off-Duty</option>
                        </select>
                     </div>

                                {/*Account Information  */}

                   <div className="flex items-center gap-2 col-span-2   mt-5 pt-3 border-t border-gray-600">                   
                        <IoKeyOutline className="text-[#00D9D9] "/>
                     <h3 className="text-white">
                        Account Information
                    </h3>
                   </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Role
                  </label>
                 <div className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2  focus:outline-none ">
                <span className="text-[#00D9D9] bg-[#00d9d949] px-3 py-1 rounded-xl border-2 border-[#00d9d949]">doctor</span>
                </div>
                </div>

                <div>
                <label  className="block text-sm font-medium text-gray-400 mb-1">Temporary Password</label>              
                <div className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-[#999999]">
  <span>{newDoctor.phone}</span>
  <span className="text-gray-400 ml-2">(Phone number)</span>
              </div>
                </div>
                </div>

                       <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={closeAddModal}
              className="bg-gray-600 cursor-pointer px-4 py-2 rounded-xl text-white"
            >
              Cancel
            </button>
            <button
            type="submit"
              disabled={loading}
              className="bg-[#00C0C1] cursor-pointer px-4 py-2 rounded-xl text-white"
            >
              {loading?isEditing?'Edting Doctor...':'Creating Doctor'
            :isEditing?'Edite Doctor' :'Create Doctor'  
            }
            </button>
          </div>
                     </form>
        
        </div>
       
      </div>
    )}


    
            <div>
        {
        doctors && doctors?.length > 0 ?(
        <div className="mx-5 max-h-[500px]  rounded-2xl border-2  border-[#1F2847] overflow-y-auto ">
     <table className="w-full   text-[#999999] ">
  <thead className="bg-[#222B4F]  sticky top-0 z-5 text-[#999999]">
    <tr>
      <th className="px-4 py-3 text-center">Patient</th>
      <th className="px-4 py-3 text-center">Specialty</th>
      <th className="px-4 py-3 text-center">Contact</th>
      <th className="px-4 py-3 text-center">Status</th>
      <th className="px-4 py-3 text-center">Experience</th>
      <th className="px-4 py-3 text-center">Edite</th>
      <th className="px-4 py-3 text-center">Delete</th>
    </tr>
  </thead>

  <tbody >

   {filterPatients?.length > 0?(
  filterPatients?.map((doctor: { id: Key | null | undefined; profiles: { full_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; specialty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; currentstatus: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; experience: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; } ) => (
      <tr
        key={doctor.id}
        className="border-t border-gray-700 text-center"
      >
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span 
            onClick={()=>navigate(`/doctors/${doctor.id}`)}
            className="text-white font-medium cursor-pointer">
              {doctor.profiles.full_name}
            </span>

          </div>
        </td>

        <td className="px-4 py-3 text-[#00D9D9]">
          {doctor.specialty}
        </td>

        <td className="px-4 py-3">
          {doctor.phone}
        </td>

        <td className="px-4 py-3">
          <span
            className={`px-3 py-1 rounded-full font-semibold text-[12px] ${
    doctor.currentstatus === "Available"
    ? "bg-green-500/20 text-green-400"
    : doctor.currentstatus === "Busy"
    ? "bg-cyan-500/20 text-cyan-400"
    : doctor.currentstatus === "Off-Duty"
    ? "bg-gray-500/20 text-gray-400"
    : ""
              
            }`}
          >
            {doctor.currentstatus}
          </span>
        </td>
        
        <td className="px-4 py-3">
          {doctor.experience}
        </td>
        <td>
          <span className="cursor-pointer text-blue-500" 
          onClick={() => handleEdit(doctor)}
>Edit</span>
        </td>
        <td>
          <span
          onClick={()=>deleteDoctor(doctor.id)}
          className="cursor-pointer bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">Delete</span>
        </td>
      </tr>
    ))
    ):(
      <div className="flex justify-center items-cente my-3">
        No Doctors found
      </div>
    )
   }
  </tbody>
</table>
     
        </div>
        ):(
          <div>
No patients found          </div>
        )
        }
      </div>
    </div>
  )
}

export default Doctors