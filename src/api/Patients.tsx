import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabaseClient"
import toast from "react-hot-toast"

export const usePatiens=()=>{
    return useQuery({
        queryKey:['patients'],
        queryFn:async ()=>{
            const {data,error}=await supabase
            .from('patients')
            .select(`
                *,profiles(role,full_name,status)
                `)
                .order("created_at",{ascending:false})
                if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}
export const usePatientDetails=(id)=>{
    return useQuery({
        queryKey:['patients',id],
        queryFn:async ()=>{
            const {data,error}=await supabase
            .from('patients')
            .select(`
                *,profiles(role,full_name,status)
                `)
                .eq('id',id)
                .single()
                  if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}



export const useDeletePatient=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        async mutationFn(id){
            const {error}=await supabase.from('profiles').delete()
            .eq('id',id)
              if (error) {
        throw new Error(error.message);
      }
        },
        async onSuccess(){
            await queryClient.invalidateQueries({queryKey:['profiles']})
            await queryClient.invalidateQueries({queryKey:['patients']})
            toast.success("Patient deleted successfully.");
        } 
    })
}
