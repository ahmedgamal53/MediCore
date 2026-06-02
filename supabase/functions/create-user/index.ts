import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
 "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }




  try {


    const {
      email,
      password,
      full_name,
      phone,
      gender,
      dob,
      bloodType,
      role,
      accountStatus,

      // doctor
         specialty,
      experience,
      currentstatus
    } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name,
      role,
      status: accountStatus,
    });

  if(role==='patient'){
      await supabase.from("patients").upsert({
      id: data.user.id,
      phone,
      gender,
      date_of_birth: dob,
      Blood_Type: bloodType,
    });
  }

      //  Doctor
    if (role=== "doctor"){
      await supabase
        .from("doctors")
        .upsert({
          id: data.user.id,
          phone,
          specialty,
          experience,
          currentstatus
        });

      
    }

    return new Response(
      JSON.stringify({
        // message: "Patient Created Successfully",
      }

      ),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  }  catch (err) {
  console.error("FULL ERROR:", err);

  return new Response(
    JSON.stringify({
      success: false,
      error: String(err),
      message: err?.message,
      details: err,
    }),
    {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}
});