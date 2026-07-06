import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointmentDoctorid } from "../../../api/appointments";

const Patient = () => {
  const { data: appointments, isLoading, isError } = useAppointmentDoctorid();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const filtered = appointments?.filter((a)=>
{
  console.log((a.booking_id).split('-')[2]);
    return a.patients?.profiles.full_name.toLowerCase().includes(search.toLowerCase()) || a.booking_id.split('-')[2].includes(search)

}
  )

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading patients...</div>;
  }

  if (isError) {
    return <div className="p-6 text-center text-red-600">Failed to load patients.</div>;
  }

  const totalPages=Math.ceil((filtered?.length||0)/itemsPerPage)

  const paginatedVisits=filtered?.slice(
    (currentPage-1)*itemsPerPage,
    currentPage*itemsPerPage
  )



  return (
   <div className="min-h-screen bg-slate-50 p-6">
  {/* Header */}
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
    <p className="mt-1 text-sm text-slate-500">
      Search and manage your patients.
    </p>
  </div>

  {/* Search */}
  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <input
      type="text"
      placeholder="Search by Booking ID or Patient Name..."
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition  "
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Table */}
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr className="text-left text-sm font-semibold text-slate-600">
            <th className="px-6 py-4">Booking ID</th>
            <th className="px-6 py-4">Patient</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Time</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 ">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered?.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-12 text-center text-slate-500"
              >
                No matching patients found.
              </td>
            </tr>
          ) : (
            paginatedVisits?.map((a) => (
              <tr
                key={a.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <span className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                    {a.booking_id.split("-")[2]}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium text-slate-800">
                  {a.patients?.profiles?.full_name || "—"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {a.appointment_date}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {a.appointment_time}
                </td>

                <td className="px-6 py-4">
                  <span
               className={`rounded-full px-3 py-1 text-sm font-medium border
    ${
      a?.status === "Scheduled"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : a?.status === "In Progress"
        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
        : a?.status === "completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-red-100 text-red-700 border-red-200"
    }
  `}
                  >
                    {a.status}
                  </span>
                </td>

              <td className="px-2 py-4 ">
  <button
    onClick={() => navigate(`/patient/${a.id}`)}
    className="rounded-xl bg-[#16B5E5] cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0EA5D3]"
  >
    View Details
  </button>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    
  </div>
  
  <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-sm font-medium text-slate-700">
      Page <span className="text-cyan-600">{currentPage}</span> of{" "}
      <span className="text-slate-900">{totalPages}</span>
    </p>

 
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
    >
      ← Previous
    </button>

    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all duration-200
            ${
              currentPage === index + 1
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
    >
      Next →
    </button>
  </div>
</div>
</div>
  );
};

export default Patient;
