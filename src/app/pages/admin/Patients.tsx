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
  const {data:patients,isLoading}=usePatiens()
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
toast.error("This email has already been taken.");
  return;
} else {
  toast.success("Patient Created Successfully");
}


const {error:activityError }=await supabase
.from("recent_activity")
.insert({
  patient_name:newPatient.name,
type: "patient_created",
title:"New patient added",
description:`${newPatient.name} `

})
if (activityError) {
  console.error(activityError);
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
<div className="bg-[#F6F8FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="pb-6 mb-6 border-b border-slate-200">
          <h2 className="text-slate-900 text-3xl font-bold">Patients</h2>
          <p className="text-slate-500 text-[15px] mt-1">Manage patient records</p>
        </div>
        {/* Search and add patient */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center relative w-[220px] md:w-[420px]">
              <FaSearch className="text-slate-400 absolute left-4 text-sm" />
              <input
                type="search"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 outline-none rounded-2xl text-sm text-slate-900 placeholder-slate-400 shadow-sm   transition-all duration-200"
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <button
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
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
          className="fixed inset-0 flex items-center z-50 justify-center bg-black/25 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 p-8 rounded-[30px] w-xl shadow-[0_25px_80px_rgba(15,23,42,.12)] max-h-[90vh] overflow-y-auto"

          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-3 py-3 rounded-2xl text-xl shadow-md">
                <MdPersonAddAlt />
              </div>
              <h3 className="text-slate-900 text-xl font-semibold">{isEditing ? 'Edit Patient' : 'Add Patient'}</h3>
            </div>
            <p className="mb-4 text-slate-500 border-b border-slate-200 pb-4">
              Create a patient account and medical profile
            </p>

            <form onSubmit={isEditing?handleEditPatient :handleAddPatient} className="space-y-4">
              {/* Basic Information */}
              <div className="">
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
                    name="name"
                    placeholder="Full Name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none   transition-all"
                  />
                </div>

                {/* Email Address */}
                {!isEditing && (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      Email Address
    </label>
    <input
      name="email"
      placeholder="Email Address"
      type="email"
      value={newPatient.email}
      onChange={handleInputChange}
      required
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none   transition-all"
    />
  </div>
)}

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={newPatient.phone}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none   transition-all"
                  />
                </div>

                {/* Date of Birth */}
                {
                  !isEditing&&(
                    <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Date of Birth
                  </label>
                  <input
                    name="dob"
                    type="date"
                    placeholder="Date of Birth"
                    value={newPatient.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none   transition-all"
                  />
                </div>
                  )
                }

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={newPatient.gender}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none   transition-all"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    value={newPatient.bloodType}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none   transition-all"
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

                <div className="mt-5 pt-4 border-t border-slate-200 ">
                   <div className="flex items-center gap-2 mb-4">                   
                        <IoKeyOutline className="text-emerald-600"/>
                     <h3 className="text-slate-900 font-semibold">
                        Account Information
                    </h3>
                   </div>
                   <div className="grid grid-cols-2 gap-4 ">
                    <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Role
                  </label>
                 <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none">
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">Patient</span>
                </div>
                </div>

                <div>
                <label  className="block text-sm font-medium text-slate-600 mb-1">Temporary Password</label>              
                <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
  <span>{newPatient.phone}</span>
  <span className="text-slate-400 ml-2">(Phone number)</span>
              </div>
                </div>
                <div className="col-span-2">
                <label  className="block text-sm font-medium text-slate-600 mb-1">Account Status</label>              
                <div className="w-full flex  items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
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
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white disabled:opacity-50 disabled:cursor-no-drop cursor-pointer px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
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
  ) : patients && patients.length > 0 ? (
    <div className="max-h-[500px] rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,.06)] overflow-y-auto">
      <table className="w-full text-slate-500">
        <thead className="bg-slate-50 sticky top-0 z-5 text-slate-500">
          <tr>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Patient
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Blood Type
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Contact
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wide">
              Status
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
          {filterPatients && filterPatients.length > 0 ? (
            filterPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-t border-slate-100 text-center hover:bg-emerald-50 transition"
              >
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="text-slate-900 font-medium cursor-pointer hover:text-emerald-700 transition-all duration-300"
                    >
                      {patient.profiles.full_name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-emerald-600 font-medium">
                  {patient.Blood_Type}
                </td>

                <td className="px-4 py-4">{patient.phone}</td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      patient.profiles.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-500 border border-red-100"
                    }`}
                  >
                    {patient.profiles.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    onClick={() => handleEdit(patient)}
                    className="cursor-pointer text-emerald-600 font-medium hover:text-emerald-700 transition-all duration-300"
                  >
                    Edit
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    onClick={() => deletepatient(patient.id)}
                    className="cursor-pointer bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-100 transition-all duration-300"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-10 text-center text-slate-500">
                No patients found
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
  );
};

export default Patients;
