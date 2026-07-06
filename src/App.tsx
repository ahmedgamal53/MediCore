import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signin from "./app/auth/Signin"
import ProtectedRoute from "./app/pages/admin/ProtectedRoute"
import Dashboard from "./app/pages/admin/Dashboard"
import Layout from "./components/Layout"
import Patients from "./app/pages/admin/Patients"
import Doctors from "./app/pages/admin/Doctors"
import Appointments from "./app/pages/admin/Appointments"
import { Toaster } from "react-hot-toast";
import Home from "./app/pages/patients/Home"
import ProtectedPatients from "./app/pages/patients/ProtectedPatients"
import PatientID from "./app/pages/admin/patientID"
import DoctorID from "./app/pages/admin/DoctorID"
import ProtectedDoctor from "./app/pages/doctor/ProtectedDoctor"
import DashbordDoctor from "./app/pages/doctor/DashbordDoctor"
import LayoutDoctor from "./app/pages/doctor/LayoutDoctor"
import PatientVisit from "./app/pages/doctor/PatientVisit"
import Schedule from "./app/pages/doctor/Schedule";
import DoctorPatients from "./app/pages/doctor/Patients";
import PatientDetails from "./app/pages/doctor/PatientDetails";
import LayoutPatient from "./app/pages/patients/LayoutPatient"
import DoctorsPatient from "./app/pages/patients/DoctorsPatient"
import SchedulePatient from "./app/pages/patients/Schedule"
import { useEffect } from "react"
import Patient from "./app/pages/doctor/Patients"
import MedicalHistory from "./app/pages/patients/MedicalHistory"

function App() {




  useEffect(() => {
  let hiddenAt = 0;

  const handleVisibility = () => {
    if (document.visibilityState === "hidden") {
      hiddenAt = Date.now();
    } else {
      const elapsed = Date.now() - hiddenAt;

      if (elapsed > 60 * 1000) {
        window.location.reload();
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, []);



  return (
    <BrowserRouter>
    <Toaster/>
    <Routes>
      <Route index element={<Signin/>}/>

      <Route element={<ProtectedRoute/>}>
      <Route element={<Layout/>}>
      {/* admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientID />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorID />} />
        <Route path="/appointments" element={<Appointments />} />
      </Route>
      </Route>

      {/* Doctor */}
      <Route element={<ProtectedDoctor/>}>
      <Route element={<LayoutDoctor/>}>

      <Route path="/doctor" element={<DashbordDoctor/>}/>
      <Route path="Patient" element={<Patient/>}/>
      <Route path="Patient/:id" element={<PatientDetails/>}/>
      <Route path="/visits" element={<PatientVisit/>}/>
      <Route path="/scheduleDoctor" element={<Schedule/>}/>
<Route path="/doctor/patients" element={<DoctorPatients/>}/>
<Route path="/doctor/patient/:id" element={<PatientDetails/>}/>
</Route>
      </Route>
      
      {/* patients */}
      <Route element={<ProtectedPatients/>}>
      <Route element={<LayoutPatient/>}>

      <Route path="/home" element={<Home/>}/>
      <Route path="/doctorsPatient" element={<DoctorsPatient/>}/>
      <Route path="/schedule"element={<SchedulePatient/>}/>
      <Route path="/medical"element={<MedicalHistory/>}/>
</Route>
      </Route>

      
    </Routes>
    </BrowserRouter>
  )
}

export default App

