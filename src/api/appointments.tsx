import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabaseClient"
import { useAuth } from "../context/Authprovider"
import toast from "react-hot-toast"

export const useAppointment=()=>{
    return useQuery({
        queryKey:['appointments'],
        queryFn:async()=>{
            const {data ,error}=await supabase
            .from('appointments')
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))`)
               .order('created_at',{ascending:false})
               if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}
export const useAppointmentid=()=>{
    const {session}=useAuth()
    return useQuery({
        queryKey:['appointments',session?.user.id],
        queryFn:async()=>{
            const {data ,error}=await supabase
            .from('appointments')
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))`)
            .eq('patient_id',session?.user.id)
               .order('created_at',{ascending:false})
               if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}

export const useAppointmentDoctorid=()=>{
    const {session}=useAuth()
    return useQuery({
        queryKey:['appointments',session?.user.id],
        queryFn:async()=>{
            const {data,error}=await supabase
            .from("appointments")
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))
                `)
            .eq('doctor_id',session?.user.id)
            .order('created_at',{ascending:false})
  if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}
export const useAppointmentDoctor=(id:string)=>{
    
    return useQuery({
        queryKey:['appointments',id],
        queryFn:async()=>{
            const {data,error}=await supabase
            .from("appointments")
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))
                `)
            .eq('doctor_id',id)
            .order('created_at',{ascending:false})
  if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}
export const useAppointmentPatient=(id:string)=>{
    
    return useQuery({
        queryKey:['appointments',id],
        queryFn:async()=>{
            const {data,error}=await supabase
            .from("appointments")
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))
                `)
            .eq('patient_id',id)
            .order('created_at',{ascending:false})
  if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}

export const useuseAppointmentid=(id:string)=>{
    return useQuery({
        queryKey:['appointments',id],
        queryFn:async()=>{
               const {data,error}=await supabase
            .from("appointments")
            .select(`*,doctors(*,
                profiles(full_name)
                ),
                patients(*,profiles(full_name))
                `)
            .eq('id',id)
            .order('created_at',{ascending:false})
  if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}

export const useDeleteAppointment=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        async mutationFn(id){
            const {error}=await supabase
            .from('appointments')
            .delete()
            .eq('id',id)
                    if (error) {
        throw new Error(error.message);
      }
        },
        async onSuccess(){
            await queryClient.invalidateQueries({queryKey:['appointments']})
            toast.success("Appointment deleted successfully.");
        }
    })
}