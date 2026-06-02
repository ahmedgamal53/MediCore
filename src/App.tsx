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
import Schedule from "./app/pages/doctor/Schedule"
import SidebarPatient from "./components/SidebarPatient"
import LayoutPatient from "./app/pages/patients/LayoutPatient"
import DoctorsPatient from "./app/pages/patients/DoctorsPatient"

function App() {

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
      <Route path="/visits" element={<PatientVisit/>}/>
      <Route path="/schedule" element={<Schedule/>}/>
</Route>
      </Route>
      
      {/* patients */}
      <Route element={<ProtectedPatients/>}>
<Route element={<LayoutPatient/>}>

      <Route path="/home" element={<Home/>}/>
      <Route path="/doctorsPatient" element={<DoctorsPatient/>}/>
</Route>
      </Route>

      
    </Routes>
    </BrowserRouter>
  )
}

export default App

