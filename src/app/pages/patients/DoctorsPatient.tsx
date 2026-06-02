import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useDoctors } from '../../../api/Doctors';

const DoctorsPatient = () => {
      const [search, setSearch] = useState("");
      const [selectedSpecialty, setSelectedSpecialty] = useState("All");
    const {data:doctors}=useDoctors()
    console.log(doctors);
    

const filterDoctor=doctors?.filter((doctor)=>{
    if(selectedSpecialty==="All"){
       return doctor.profiles.full_name.toLowerCase().includes(search.toLowerCase())
    }else{
        return doctor.specialty===selectedSpecialty && doctor.profiles.full_name.toLowerCase().includes(search.toLowerCase())
    }
})

  return (
    <div className="bg-[#070E16] min-h-screen">
          <div className="ml-5">
            <div className="py-3 border-b border-b-gray-700">
              <h2 className="text-white text-2xl font-semibold">Find a Doctor</h2>
              <p className="text-gray-400 text-[15px]">Browse our experienced doctors and book an appointment</p>
            </div>

                <div className="flex mt-5 items-center relative w-[180px] md:w-[450px]">
                              <FaSearch className="text-gray-400 absolute left-3 text-sm" />
                              <input
                                type="search"
                                placeholder="Search doctors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#191e24c5] border border-transparent pl-9 pr-3 py-2 outline-none rounded-xl text-sm text-white placeholder-gray-400 transition-all duration-200"
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
            ? "bg-cyan-500 text-black"
            : "bg-[#071426] text-gray-300 hover:bg-[#0d1d33]"
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
      className="bg-[#020c1b] border border-cyan-900 rounded-3xl p-6 flex flex-col items-center text-center"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full border-2 border-cyan-700 bg-cyan-900/20 flex items-center justify-center text-cyan-400 text-2xl font-semibold">
        {doctor?.profiles?.full_name
          ?.split(" ") //Array
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </div>

      {/* Name */}
      <h2 className="text-white text-3xl font-semibold mt-6">
        {doctor.profiles.full_name}
      </h2>

      {/* Specialty */}
      <h3 className="text-cyan-400 font-medium mt-2">
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
      <button className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-2xl font-medium transition-all">
        Book Appointment
      </button>
    </div>
  ))}
</div>

            </div>
            </div>
  )
}

export default DoctorsPatient