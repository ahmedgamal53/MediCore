import React from 'react'
import { supabase } from '../../../supabaseClient'

const Home = () => {
  return (
    <div>
        <button 
        className='cursor-pointer'
        onClick={()=>supabase.auth.signOut()}>
            log out 
        </button>
    </div>
  )
}

export default Home