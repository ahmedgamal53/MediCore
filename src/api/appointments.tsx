import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabaseClient"
import { useAuth } from "../context/Authprovider"

export const useAppointment=()=>{
    return useQuery({
        queryKey:['appointments'],
        queryFn:async()=>{
            const {data ,error}=await supabase
            .from('appointments')
            .select(`*,doctors(*,
                profiles(full_name)
                )`)
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
                )`)
            .eq('patient_id',session?.user.id)
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
        }
    })
}