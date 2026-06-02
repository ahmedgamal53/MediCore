import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";


const events = [
  {
    title: "Ahmed Ali",
    start: "2026-05-28T09:00:00",
    end: "2026-05-28T10:00:00",
  },
  {
    title: "Mohamed Hassan",
    start: "2026-05-28T12:00:00",
    end: "2026-05-28T13:00:00",
  },
];

const Schedule = () => {
  const handleDateClick = (info: any) => {
    alert('Hello');
  };

  return (
    <div className="p-6 bg-[#020817] min-h-screen text-white">
      <div className="bg-[#081028] p-4 rounded-2xl border border-[#1E293B]">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            
          ]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          height="85vh"
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:30:00"
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