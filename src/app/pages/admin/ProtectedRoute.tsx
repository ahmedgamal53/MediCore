import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../../context/Authprovider"
import { RingLoader } from "react-spinners"

const ProtectedRoute = () => {
    const {loading,session,isAdmin}=useAuth()
     if(loading)
        return(
             <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
        )
     if(!session){
        return <Navigate to='/' replace/>
    }
   
     if(!isAdmin){
            return <Navigate to='/' replace/>
  }
    
  
   
  return (
    <Outlet/>
  )
}

export default ProtectedRoute