/* So this is the meat and potatoes of the project, for right now 
I'm planning on having like a component for both the create and list, this however may be more difficult than anticipated

1. Have the website logged in even after authorizing (on refresh after submmitting) -> Done {emulated}
2. Be able to submit a job, to a database (supabase). -> No
3. Reflect that change (if successfully made??) -> No
*/

export default function ApplicationList(){



    return(
        <div>
            {/* Need a way to input a job, (don't worry about connection first)
                For right now assume you're just inputting data that is to be submitted elsewhere 
                
                Data: I would like to be able to add to an application I'm tracking
                    - Company: Name 
                    - Job: Title
                    - Status: At what stage my application is in
                    - When: Applied
                    - Link: Hyperlink to the site/where it is
                    - Comments: (Maybe not sure yet)
            */}

            {/* Form  {Make flexbox} */} 
            {/* <form action=""> Action is for sending data to a site (like the python api routes I had set up in that other project)*/}
            <form onSubmit={() => console.log("submitted")} className="flex flex-col gap-4">
                <label htmlFor="company">Company</label>
                <input required type="text" name="company" id="company" />
                <label htmlFor="job">Job</label>
                <input type="text" name="job" id="job" />
                <label htmlFor="status">Status</label>
                <input type="text" name="status" id="status" />
                <label htmlFor="date">Date</label>
                <input type="text" name="date" id="date" />
                <label htmlFor="Link">Link</label>
                <input type="text" name="Link" id="Link" />
            </form>
            <button type="submit" onSubmit={() => console.log("submitted")}>Submit</button>
        </div>
    );
}