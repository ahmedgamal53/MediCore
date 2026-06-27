import { useState, ChangeEvent, FormEvent} from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { MdPersonAddAlt } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import toast from "react-hot-toast";
import React from "react";
import { supabase } from "../../../supabaseClient";
import { useDeletePatient,  usePatiens } from "../../../api/Patients";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Patients = () => {
const {mutate:deletepatient}=useDeletePatient()


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [checked, setChecked] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const {data:patients}=usePatiens()
  const [showAddModal, setShowAddModal] = useState(false);
  
const [isEditing, setIsEditing] = useState(false);

const [selectedPatient, setSelectedPatient] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodType: "",
    role: "patient",
    accountStatus: 'Active',
  });

const navigate=useNavigate()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 const value = event.target.checked;

  setChecked(value);

  setNewPatient({
    ...newPatient,
    accountStatus: value?"Active":"Inactive",
  });    
  };
  const openAddModal = () => {
  setIsEditing(false);
  setNewPatient({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodType: "",
    role: "patient",
    accountStatus: 'Active',
  });
  setChecked(true);
  setShowAddModal(true);
};
  const closeAddModal = () => setShowAddModal(false);





const handleEdit = (patient: { profiles: { status: string; full_name: string; email: string; }; phone: string; dob: any; gender: string; Blood_Type: string; }) => {
  setSelectedPatient(patient)
  setIsEditing(true);
  setChecked(patient.profiles?.status === "Active");
  setNewPatient({
    name: patient.profiles?.full_name || "",
    email: patient.profiles?.email || "",
    phone: patient.phone || "",
    dob: patient.dob || "",
    gender: patient.gender || "",
    bloodType: patient.Blood_Type || "",
    role: "patient",
    accountStatus: patient.profiles?.status || "Active",
  });
  setShowAddModal(true);
};

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };


const queryClient =useQueryClient()



const handleAddPatient = async (e: FormEvent) => {
  e.preventDefault();

  setLoading(true);

  try {
    const {  error } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
          email: newPatient.email,
          password: newPatient.phone,
          full_name: newPatient.name,
          phone: newPatient.phone,
          gender: newPatient.gender,
          dob: newPatient.dob,
          bloodType: newPatient.bloodType,
          role: newPatient.role,
          accountStatus: newPatient.accountStatus,
        },
      }
    );
  if (error) {
  alert(error.message);
  return;
} else {
  toast.success("Patient Created Successfully");
}
    await queryClient.invalidateQueries({queryKey:['patients']})
    await queryClient.invalidateQueries({queryKey:['profiles']})

    closeAddModal();

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};



// edite

const handleEditPatient = async (e:FormEvent) => {

  e.preventDefault();

  setLoading(true);

  try {


    const { error: patientError } = await supabase
      .from("patients")
      .update({
        phone: newPatient.phone,
        gender: newPatient.gender,
        Blood_Type: newPatient.bloodType,
      })
      .eq("id", selectedPatient.id);

    if (patientError) throw patientError;

    // update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: newPatient.name,
        status: newPatient.accountStatus,
      })
      .eq("id", selectedPatient.id);

    if (profileError) throw profileError;

    toast.success("Patient Updated Successfully");

        await queryClient.invalidateQueries({queryKey:['patients']})
    await queryClient.invalidateQueries({queryKey:['profiles']})
    closeAddModal();

  } catch (error) {

    console.log(error);

    toast.error("Something went wrong");

  } finally {

    setLoading(false);

  }
};


const filterPatients = patients?.filter((patient) => {
  if (status === "All") {
    return  patient?.profiles?.full_name.toLowerCase().includes(search.toLowerCase()); 
   }else{
    return patient?.profiles.status === String(status) && patient.profiles?.full_name.toLowerCase().includes(search.toLowerCase())

   }
});





  return (
    <div className="bg-[#070E16] h-screen">
      <div className="ml-5">
        <div className="py-3 border-b border-b-gray-700">
          <h2 className="text-white text-2xl font-semibold">Patients</h2>
          <p className="text-gray-400 text-[15px]">Manage patient records</p>
        </div>
        {/* Search and add patient */}
        <div className="flex justify-between items-center">
          <div className="py-3 flex items-center gap-3">
            <div className="flex items-center relative w-[180px] md:w-[450px]">
              <FaSearch className="text-gray-400 absolute left-3 text-sm" />
              <input
                type="search"
                placeholder="Search patients..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mr-10">
            <button
              className="bg-[#00C0C1] px-2 py-3 rounded-xl cursor-pointer"
              onClick={openAddModal}
            >
              Add patient
            </button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 flex items-center z-50 justify-center bg-black/40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F171F] border-2 border-[#1F2847] p-6 rounded-xl w-xl "

          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#18203F] text-[#00D9D9] px-2 py-2 rounded-xl text-xl">
                <MdPersonAddAlt />
              </div>
              <h3 className="text-white text-xl">{isEditing ? 'Edit Patient' : 'Add Patient'}</h3>
            </div>
            <p className="mb-3 text-[#999999] border-b border-gray-600 py-2">
              Create a patient account and medical profile
            </p>

            <form onSubmit={isEditing?handleEditPatient :handleAddPatient} className="space-y-4">
              {/* Basic Information */}
              <div className="">
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
                    name="name"
                    placeholder="Full Name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
                  />
                </div>

                {/* Email Address */}
                {!isEditing && (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">
      Email Address
    </label>
    <input
      name="email"
      placeholder="Email Address"
      type="email"
      value={newPatient.email}
      onChange={handleInputChange}
      required
      className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
    />
  </div>
)}

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={newPatient.phone}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none "
                  />
                </div>

                {/* Date of Birth */}
                {
                  !isEditing&&(
                    <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date of Birth
                  </label>
                  <input
                    name="dob"
                    type="date"
                    placeholder="Date of Birth"
                    value={newPatient.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:outline-none  "
                  />
                </div>
                  )
                }

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={newPatient.gender}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white  "
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    value={newPatient.bloodType}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-white  "
                  >
                    <option value="" disabled>Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                </div>
                {/*Account Information  */}

                <div className="mt-5 pt-3 border-t border-gray-600 ">
                   <div className="flex items-center gap-2  mb-4">                   
                        <IoKeyOutline className="text-[#00D9D9] "/>
                     <h3 className="text-white">
                        Account Information
                    </h3>
                   </div>
                   <div className="grid grid-cols-2 gap-4 ">
                    <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Role
                  </label>
                 <div className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2  focus:outline-none ">
                <span className="text-[#00D9D9] bg-[#00d9d949] px-3 py-1 rounded-xl border-2 border-[#00d9d949]">Patient</span>
                </div>
                </div>

                <div>
                <label  className="block text-sm font-medium text-gray-400 mb-1">Temporary Password</label>              
                <div className="w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-[#999999]">
  <span>{newPatient.phone}</span>
  <span className="text-gray-400 ml-2">(Phone number)</span>
              </div>
                </div>
                <div className="col-span-2">
                <label  className="block text-sm font-medium text-gray-400 mb-1">Account Status</label>              
                <div className="w-full flex  items-center justify-between rounded-xl border border-gray-600 bg-gray-800 px-3 py-2">
                <Stack direction="row" spacing={1} useFlexGap>
                <Chip
          size="small"
          
          label={checked ? 'Active' : 'Inactive'}
          color={checked ? 'success' : 'default'}
        />
      </Stack>
              <Switch
      checked={checked}
      onChange={handleChange}
      slotProps={{ input: { 'aria-label': 'controlled' } }}
    />
                </div>
                </div>
                </div>
                </div>

         </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 rounded-xl cursor-pointer bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl disabled:cursor-no-drop cursor-pointer bg-[#00C0C1] text-white"
                >
                  {
                    loading?isEditing?'Editing Patient...':'Creating Patient...'
                    :isEditing?  'Edit Patient': 'Create Patient'
                    
                  }
                
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* tabel */}
      <div>
        {
        patients && patients?.length > 0 ?(
        <div className="mx-5 max-h-[500px]  rounded-2xl border-2  border-[#1F2847] overflow-y-auto ">
     <table className="w-full   text-[#999999] ">
  <thead className="bg-[#222B4F]  sticky top-0 z-5 text-[#999999]">
    <tr>
      <th className="px-4 py-3 text-center">Patient</th>
      <th className="px-4 py-3 text-center">Blood Type</th>
      <th className="px-4 py-3 text-center">Contact</th>
      <th className="px-4 py-3 text-center">Status</th>
      <th className="px-4 py-3 text-center">Edite</th>
      <th className="px-4 py-3 text-center">Delete</th>
    </tr>
  </thead>

  <tbody >

   {filterPatients?.length > 0 &&patients ?(
  filterPatients?.map((patient ) => (
      <tr
        key={patient.id}
        className="border-t border-gray-700 text-center"
      >
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span 
            onClick={()=>navigate(`/patients/${patient.id}`)}
            className="text-white font-medium cursor-pointer">
              {patient.profiles.full_name}
            </span>

          </div>
        </td>

        <td className="px-4 py-3">
          {patient.Blood_Type}
        </td>

        <td className="px-4 py-3">
          {patient.phone}
        </td>

        <td className="px-4 py-3">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              patient.profiles.status === "Active"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {patient.profiles.status}
          </span>
        </td>
        <td>
          <span className="cursor-pointer text-blue-500" onClick={() => handleEdit(patient)}>Edit</span>
        </td>
        <td>
          <span
          onClick={()=>deletepatient(patient.id)}
          className="cursor-pointer bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">Delete</span>
        </td>
      </tr>
    ))
    ):(
      <div className="flex justify-center items-cente my-3">
        No patients found
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
  );
};

export default Patients;
