/* 
The main idea of this is to
1. make a website that requires an authorized for access (auth) -> handle in <ApplicationShell>
2. Allow user to make submissions of jobs they are applying for -> handle in separate comp
3. on submit send that to a database (supabase) and track it there -< handle in 3rd separate com
*/
"use client"
import AuthComp from "./AuthComp";
import ApplicationList from "./ApplicationList";
import React from "react";
import { useMemo, useEffect, useState } from "react"; // Makes the page refresh on state value modification

// My Supabase files
// import { createBrowserSupabaseClient } from "@/lib/supabase/client.ts";

/*

*/
import { createBrowserSupabaseClient } from "@/lib/supabase/client"; // This is the function that creates a browser client for supabase, which is responsible for creating a cookie to track the logged in state of the user
import type { Session } from "@supabase/supabase-js"; // This is the type for the session object that we will be using to track the logged in state of the user

// DOM root entry "top level component"
export default function ApplicationShell(){
    // States are passed from parents to children, since this is the highest order comp
    // Pass logged in state to AuthComp
    // const [LoggedIn, setLoggedIn] = useState(false)
    const supabase = useMemo(() => createBrowserSupabaseClient(), []); // This creates a memoized version of the supabase client, which will only be created once and will be reused on subsequent renders
    const [session, setSession] = useState<Session | null>(null); // This is the state that will hold the session object, which will be used to track the logged in state of the user
    const [authLoading, setAuthLoading] = useState(() => supabase !== null); // This is the state that will track whether the auth state is still loading or not, which will be used to conditionally render the auth component

    useEffect(() => {
        // This runs on mount
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setAuthLoading(false);
        };

        getSession();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        // Cleanup the listener on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);
    

    // UseEffect: these are the functions that we need to UPDATE TO REFLECT ON SCREEN
    /* LoggedIn, ... 
    
    EXAMPLE:
    useEffect(() => {
        // This runs on mount *and also* if either a or b have changed since the last render
    }, [a, b]);
    */

    // useEffect(() => {
    //         if(!LoggedIn) {
    //             return(<><AuthComp LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/></>);
    //         }
    //     }
    // )

    return(
        // <div className="">
        //     {!LoggedIn && <AuthComp LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/>}
        //     {/* need to be able to tell if the login was successful in order to continue/remove auth panel */}
        //     {/* {loggedInState ? <COMP/> : null (do nothing and wait until logged in)} */}
        //     { LoggedIn ? (<ApplicationList/>) : null }
        // </div>
        <div>
            <AuthComp supabase={supabase} session={session} authLoading={authLoading} />
            <div className="">tk</div>
        </div>
    );
}


/*
useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
*/