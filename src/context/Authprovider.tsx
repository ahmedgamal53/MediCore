import {  type Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { supabase } from "../supabaseClient";
type AuthData={
    session:Session|null;
loading:boolean;
profile:null;
isAdmin:boolean
isPatient:boolean
isDoctor:boolean
}

const Authcontext=createContext<AuthData>({
    session:null,
    loading:true,
    profile:null,
  isAdmin:false,
  isPatient:false,
  isDoctor:false
})


const Authprovider = ({children}:PropsWithChildren) => {
    const [session,setsession]=useState<Session|null>(null)
    const [loading,setloading]=useState(true)
    const [profile,setprofile]=useState(null)

      const initialized = useRef(false);

        const fetchProfile=async (userId:unknown)=>{
            const {data}=await supabase
             .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
        }
    useEffect(()=>{
        const fetchsession=async ()=>{
            const {data:{session}}=await supabase.auth.getSession()
            setsession(session)
            console.log(session?.user.id);
            
            if(session?.user){
               const data =await fetchProfile(session.user.id)
               setprofile(data)
            }
            setloading(false)
                  initialized.current = true;
        }
        fetchsession()
        const {data:{ subscription }}= supabase.auth.onAuthStateChange(
             (_event,session)=>{
                   if (!initialized.current) return;
                setsession(session)

    setTimeout(async () => {
        if (session?.user) {
          const data = await fetchProfile(session.user.id);
          setprofile(data);
        } else {
          setprofile(null);
        }
      }, 0);
            }
        )

        return ()=>{
   subscription.unsubscribe();        }
    },[])
    

    
    
  return (
    <Authcontext.Provider value={{session,loading,profile,isAdmin:profile?.role==='admin',isPatient:profile?.role==='patient',isDoctor:profile?.role==="doctor"}}>
        {children}
    </Authcontext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth=()=>useContext(Authcontext)
export default Authprovider