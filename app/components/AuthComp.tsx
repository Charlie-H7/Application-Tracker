// For right now the idea behind this code is to implement react state, to (for right now) click
// a button to emulate being logged in
"use client"
import { useState } from "react";





export default function AuthComp(){
    // State
    const [clicked, setClick] = useState(false)

    // Handlers
    async function HandleClick(){
        setClick(true)
    }

    return(
        <div>
            <div className="rounded-2xl border border-red-500">
                <div className="text-sm">Sign in</div>
                <div className="text-xs">test</div>
                <button className="bg-blue-500" onClick={HandleClick}>Hi</button>                
            </div>
            {clicked ? <div>you logged in!</div> : <div>please log in</div>} {/* Conditional rendering in tsx */}
        </div>
    );
}

// <form action="mt-4 grid gap-3 sm:grid-cols-2">
//                     <label>Email</label>
//                     <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
//                         Email
//                     </span>
//                     <input
//                         type="email"
//                         autoComplete="email"
//                         required
//                         className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
//                     />
//                 </form>