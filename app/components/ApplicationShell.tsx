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
import { useEffect, useState } from "react"; // Makes the page refresh on state value modification

// DOM root entry "top level component"
export default function ApplicationShell(){
    // States are passed from parents to children, since this is the highest order comp
    // Pass logged in state to AuthComp
    const [LoggedIn, setLoggedIn] = useState(false)
    

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
        <div className="">
            {!LoggedIn && <AuthComp LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/>}
            {/* need to be able to tell if the login was successful in order to continue/remove auth panel */}
            {/* {loggedInState ? <COMP/> : null (do nothing and wait until logged in)} */}
            { LoggedIn ? (<ApplicationList/>) : null }
        </div>
    );
}


/*
useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
*/