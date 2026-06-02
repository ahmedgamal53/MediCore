import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabaseClient"

export const useProfiles=()=>{
    return useQuery({
        queryKey:['profiles'],
        queryFn:async ()=>{
            const {data,error}=await supabase
            .from('profiles')
            .select(`
                *
                `)
                if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}