import { RingLoader } from "react-spinners";
import { useAuth } from "../../../context/Authprovider";
import { Navigate, Outlet } from "react-router-dom";




const ProtectedPatients = () => {
    const {loading,session,isPatient}=useAuth()
     if(loading)
        return(
             <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
        )
     if(!session){
        return <Navigate to='/' replace/>
    }
   
    
        if(!isPatient){
            return <Navigate to='/' replace/>
  }
    
  return (
    <Outlet/>
  )
}

export default ProtectedPatients