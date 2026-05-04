// For right now the idea behind this code is to implement react state, to (for right now) click
// a button to emulate being logged in
"use client"
import { useState } from "react";
import React from "react"; // Allows for typing


// This is the special feature of react being showcased!
// Without the following defenition, it'll render. However, you'll be notified that you should define typing
// (guessing its to avoid missusing props) Looks like a struct!
type AuthPanelProps = {
    LoggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

}

// NOTE: you must assign the Prop typing within def
export default function AuthComp( {LoggedIn, setLoggedIn} : AuthPanelProps ){ 

    // Handlers
    async function HandleClick(){
        setLoggedIn(true)
    }

    // This is logic for returning shit in the case where you are not logged in {hmm for a moment, thought it might have been been like ternary logic}
    // Ideally, we are just DEFINING component, which means parent should be in charge of deciding whether to show it or not.
    return(
        <div>
            <div className="rounded-2xl border border-red-500">
                <div className="text-sm">Sign in</div>
                <div className="text-xs">test</div>
                <button className="bg-blue-500" onClick={HandleClick}>Hi</button>                
            </div>
            {LoggedIn ? <div>you logged in!</div> : <div>please log in</div>} {/* Conditional rendering in tsx */}
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