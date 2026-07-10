import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabaseClient";

export const useRecentActivity=()=>{
    return useQuery({
        queryKey:['recent_activity'],
        queryFn:async ()=>{
            const { data,error } = await supabase
  .from("recent_activity")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(5);
        if (error) {
        throw new Error(error.message);
      }
      return data;
        }
    })
}