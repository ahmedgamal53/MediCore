import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Navigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { useAuth } from "../../context/Authprovider";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const {isAdmin,isPatient,isDoctor}=useAuth()


  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const {error}=await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if(error){
        alert(error.message)
        setLoading(false)
        return
    }else{
        setLoading(false)
    }
  };

  if(isAdmin){
              return <Navigate to='/dashboard' />
    }else if(isPatient){
      return <Navigate to='/home'/>
    }else if(isDoctor){
      return <Navigate to='/doctor'/>
    }
    


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm  bg-white rounded-md p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Sign In
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 px-2 py-2 outline-none block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 px-2 py-2 outline-none block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {
            !loading?'Sign in':'Signing...'
          }
        </button>
      </form>

        {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/10 ">
          <RingLoader  color="#3b82f6" size={50} />
        </div>
      )}
    </div>
  );
}
