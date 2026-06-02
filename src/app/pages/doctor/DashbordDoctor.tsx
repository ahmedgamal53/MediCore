import { supabase } from "../../../supabaseClient"

const DashbordDoctor = () => {
  return (
    <div>Dashbd

       <button 
              className='cursor-pointer'
              onClick={()=>supabase.auth.signOut()}>
                  log out 
              </button>
    </div>
  )
}

export default DashbordDoctor