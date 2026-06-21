import React from 'react'
import { useAppointment } from '../../../api/appointments'
import { RingLoader } from 'react-spinners'

const SchedulePatient = () => {
    const { data: schedule, isLoading, error } = useAppointment()
    console.log(schedule);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#070E16]">
                <RingLoader color="#3b82f6" size={50} />
            </div>
        )
    }
    if (error) {
        return (
            <div className="text-red-500 bg-[#070E16] min-h-screen p-5">
                Error loading appointments: {error.message}
            </div>
        )
    }

    const appointments = schedule ?? []

    return (
        <div className="bg-[#070E16] min-h-screen">
            <div className="ml-5">
                <div className="py-3 border-b border-b-gray-700">
                    <h2 className="text-white text-2xl font-semibold">My Appointments</h2>
                    <p className="text-gray-400 text-[15px]">View and manage all your medical appointments</p>
                </div>
                <h3 className='text-white text-xl font-semibold mt-2'>Upcoming Appointments</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-400 mt-4">No upcoming appointments.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-5">
                        {appointments.map((appointment: any, index: number) => (
                            <div
                                key={index}
                                className="bg-[#020c1b] border border-cyan-900 rounded-3xl p-6 flex flex-col items-center text-center"
                            >
                                {/* Avatar - doctor initials */}
                                <div className="w-20 h-20 rounded-full border-2 border-cyan-700 bg-cyan-900/20 flex items-center justify-center text-cyan-400 text-2xl font-semibold mb-4">
                                    {appointment?.doctors?.profiles?.full_name
                                        ?.split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </div>
                                {/* Doctor Name */}
                                <h2 className="text-white text-3xl font-semibold">
                                    {appointment?.doctors?.profiles?.full_name ?? 'Unknown Doctor'}
                                </h2>
                                {/* Specialty */}
                                <h3 className="text-cyan-400 font-medium mt-2">
                                    {appointment?.doctors?.specialty ?? 'Specialty'}
                                </h3>
                                {/* Booking ID */}
                                <p className="text-gray-400 mt-2">
                                    <span className="font-medium text-white">Booking ID:</span> {appointment?.id ?? 'N/A'}
                                </p>
                                {/* Date */}
                                <p className="text-gray-400 mt-1">
                                    <span className="font-medium text-white">Date:</span> {appointment?.appointment_date ?? 'N/A'}
                                </p>
                                {/* Time */}
                                <p className="text-gray-400 mt-1">
                                    <span className="font-medium text-white">Time:</span> {appointment?.appointment_time ?? 'N/A'}
                                </p>
                                {/* Type */}
                                <p className="text-gray-400 mt-1">
                                    <span className="font-medium text-white">Type:</span> {appointment?.type ?? 'N/A'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SchedulePatient