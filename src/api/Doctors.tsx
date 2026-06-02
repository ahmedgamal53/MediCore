import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabaseClient"

export const useDoctors=()=>{
    return useQuery({
        queryKey:['doctors'],
        queryFn:async ()=>{
            const {data ,error}=await supabase
            .from('doctors')
            .select(`*,profiles(role,full_name,status)`)
            .order('created_at',{ascending:false})
               if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}

export const useDoctorsDetails=(id)=>{
    return useQuery({
        queryKey:['doctors',id],
        queryFn:async ()=>{
            const {data ,error}=await supabase
            .from('doctors')
            .select(`*,profiles(role,full_name)`)
            .eq('id',id)
            .single()
               if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}

export const useDeleteDoctor=()=>{
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
            await queryClient.invalidateQueries({queryKey:['doctors']})
        } 
    })
}