// For right now the idea behind this code is to implement react state, to (for right now) click
// a button to emulate being logged in
"use client"
import { useState } from "react";
import React from "react"; // Allows for typing
import ApplicationList from "./ApplicationList";


// This is the special feature of react being showcased!
// Without the following defenition, it'll render. However, you'll be notified that you should define typing
// (guessing its to avoid missusing props) Looks like a struct!
    // type AuthPanelProps = {
    //     LoggedIn: boolean;
    //     setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

    // }

// NOTE: you must assign the Prop typing within def
export default function AuthComp( {supabase, session, authLoading} ) { 
    // Creating component that will be responsible for handling the authentication of the user, and will be conditionally rendered based on the logged in state of the user. This is a child component of the ApplicationShell component, which is the root component of the application. The idea is that if the user is not logged in, we will show the AuthComp component, which will allow the user to log in. Once the user is logged in, we will show the ApplicationList component, which will show the list of applications that the user has created. The AuthComp component will also be responsible for handling the login logic, which will involve calling the supabase client to log in the user and then updating the logged in state of the user in the ApplicationShell component.
    // Data we need to track; the Data used to submit the form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false); // This is the state that will track whether the login process is currently in progress or not, which will be used to disable the login button while the login process is ongoing to prevent multiple login attempts
    const [message, setMessage] = useState<string | null>(null); // This is the state that will hold any error messages that may occur during the login process, which will be used to display error messages to the user if the login process fails for any reason

    // const [LoggedIn, setLoggedIn] = useState(false); --- IGNORE ---
    // const { supabase } = props; --- IGNORE ---
    // const { session } = props; --- IGNORE ---
    // const { authLoading } = props; --- IGNORE ---
    // Handlers

// async function handleLogin() {
//     // Setting login state to busy before starting the login process
//     setBusy(true);
//     setMessage(null); // Clear any previous messages

//     const { error } = await supabase.auth.signInWithPassword({
//         email: email.trim(), // Trim whitespace from email input
//         password,
//     });
//     setBusy(false); // Reset busy state after login attempt

//     if (error) {
//         console.error("Error logging in:", error.message);
//         setMessage(error.message); // Set error message to display to the user
//         console.error("Sigma");
//     } else {
//         setPassword(""); // Clear password field for user on successful login
//         // console.log("I think this is the culprit");
//     }        
// }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else setPassword("");
  }

    // This is the handler for logging out the user, which will be passed down to the ApplicationList component, which will have a logout button that will call this handler when clicked
    async function handleLogout() {
        setBusy(true);
        setMessage(null)
        await supabase.auth.signOut();
        setBusy(false); // Reset busy state after logout attempt
    }

    
    

    // async function HandleClick(){
    //     setLoggedIn(true)
    // }


    // This is logic for returning shit in the case where you are not logged in {hmm for a moment, thought it might have been been like ternary logic}
    // Ideally, we are just DEFINING component, which means parent should be in charge of deciding whether to show it or not.
    // return(
    //     <div>
    //         <div className="rounded-2xl border border-red-500">
    //             <div className="text-sm">Sign in</div>
    //             <div className="text-xs">test</div>
    //             <button className="bg-blue-500" onClick={HandleClick}>Hi</button>                
    //         </div>
    //         {LoggedIn ? <div>you logged in!</div> : null} {/* Conditional rendering in tsx */}
    //     </div>
    // );

    // This is just to ensure nothing displays before the 2nd screen if they are logged in
    if (authLoading) {
        return <div>Loading...</div>;
    }


    if (session) {
        return(
            <div className="border border-red-500">
                <p>You are signed in as bruh</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        )
    }
    

    // Return if user is not logged in
    return(
        <div>
        {/* {session ? (<ApplicationList/>) :  */}
            {/* // ( 
            // <div>
            //     <form action="">
            //         <label htmlFor="email">email</label>
            //         <input required type="text" name="email" id="email" onChange={(e) => {setEmail(e.target.value)}}/>
            //         <label htmlFor="password">password</label>
            //         <input type="text" name="password" id="password" onChange={(e) => {setPassword(e.target.value)}} />
            //     </form>

            //     <button onClick={handleLogin}>Login</button>
            // </div>) */}
        {/* If there is no session user return nothing {Thats handled in applicationShell } */}
        {session ? null : ( 
            <div>
                 <form action="">
                    <label htmlFor="email">email</label>
                    <input required type="text" name="email" id="email" onChange={(e) => {setEmail(e.target.value)}}/>
                    <label htmlFor="password">password</label>
                    <input type="text" name="password" id="password" onChange={(e) => {setPassword(e.target.value)}} />
                </form>

                <button onClick={handleLogin}>Login</button>
            </div>)
        }

        {/* // (
        //     <div>
        //     <form action="">
        //         <label htmlFor="email">email</label>
        //         <input required type="text" name="email" id="email" onChange={(e) => {setEmail(e.target.value)}}/>
        //         <label htmlFor="password">password</label>
        //         <input type="text" name="password" id="password" onChange={(e) => {setPassword(e.target.value)}} />
        //     </form>

        //         <button onClick={handleLogin}>Login</button>
        //     </div>)
        //     : null
        // } */}
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