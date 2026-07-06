// import FullCalendar from "@fullcalendar/react";
import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
import timeGridPlugin from "@fullcalendar/timegrid";
// // import interactionPlugin from "@fullcalendar/interaction";
import { useAppointmentDoctorid } from "../../../api/appointments";



const Schedule = () => {
  const { data: appointments, isLoading, isError } = useAppointmentDoctorid();

 const statusColors: Record<string, string> = {
  Scheduled:  "#0f766e",   
  Pending: "#f59e0b",       
  "In Progress": "#06b6d",
  completed: "#10b981",    
  Cancelled: "#ef4444",  
};
const events =
  appointments?.map((a) => {
    const start = new Date(`${a.appointment_date}T${a.appointment_time}`);

    const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 minutes

    return {
      title:
        a.patients?.profiles?.full_name ||
        a.doctors?.profiles?.full_name ||
        "Untitled",
      start,
      end,
      color: statusColors[a.status ?? ""] ?? "#6b7280",
    };
  }) ?? [];

  const handleDateClick = (info: any) => {
    // Placeholder: you could open a modal to create a new appointment.
    alert(`Clicked on ${info.dateStr}`);
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading schedule...
      </div>
    );
  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load schedule.
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          height="85vh"
          slotMinTime="09:00:00"
          slotMaxTime="16:30:00"
          slotDuration="00:15:00"
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
        />
      </div>
    </div>
  );
};

export default Schedule;
