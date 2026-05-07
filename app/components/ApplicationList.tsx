/* So this is the meat and potatoes of the project, for right now 
I'm planning on having like a component for both the create and list, this however may be more difficult than anticipated

1. Have the website logged in even after authorizing (on refresh after submmitting) -> Done {emulated}
2. Be able to submit a job, to a database (supabase). -> No
3. Reflect that change (if successfully made??) -> No
*/

import { useState, useEffect, useMemo, useCallback, startTransition } from "react";
import React from "react"; // Allows for typing
import { ApplicationStatus, ApplicationType } from "../types/application"
import { APPLICATION_STATUSES } from "@/app/types/application";

import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchApplications } from "@/lib/application-db";
import { formatSupabaseError } from "@/lib/format-supabase-error"; // This is a utility function that formats errors from the supabase client into a more user-friendly format, which can be used to display error messages to the user in a more understandable way. By using a separate function to handle error formatting, we can centralize our error handling logic and ensure that all errors from the supabase client are consistently formatted and presented to the user in a clear and informative manner.

const emptyform = {
    company: "",
    job: "",
    status: "",
    date: "",
    link: "",
    comments: ""
}

type ApplicationsTrackerProps = {
  supabase: SupabaseClient;
};

function statusStyles(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    Wishlist:
      "bg-zinc-100 text-zinc-700 ring-zinc-500/15 dark:bg-zinc-800 dark:text-zinc-300",
    Applied:
      "bg-sky-50 text-sky-800 ring-sky-600/15 dark:bg-sky-950/60 dark:text-sky-200",
    Screening:
      "bg-violet-50 text-violet-800 ring-violet-600/15 dark:bg-violet-950/50 dark:text-violet-200",
    Interview:
      "bg-amber-50 text-amber-900 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-100",
    Offer:
      "bg-emerald-50 text-emerald-800 ring-emerald-600/15 dark:bg-emerald-950/50 dark:text-emerald-200",
    Rejected:
      "bg-rose-50 text-rose-800 ring-rose-600/15 dark:bg-rose-950/40 dark:text-rose-200",
    Withdrawn:
      "bg-neutral-100 text-neutral-700 ring-neutral-500/15 dark:bg-neutral-800 dark:text-neutral-300",
  };
  return map[status];
}

export default function ApplicationList( {supabase} : ApplicationsTrackerProps){  

    // data I need to track for each job application:
    // const [application, setApplication] = useState<ApplicationType | null>(null);
    const [application, setApplications] = useState<ApplicationType[]>([]); // This is the state that will hold an array of application objects, which will be used to track the list of applications that the user has created. The ApplicationType is a type that defines the structure of an application object, which includes fields for company, job, status, date, link, and comments (which is optional). By using an array of ApplicationType objects, we can easily manage and display a list of applications in the UI.
    const [listLoading, setListLoading] = useState(false); // This is the state that will track whether the list of applications is currently loading or not, which will be used to conditionally render a loading indicator while the list of applications is being fetched from the database. This can help improve the user experience by providing feedback that the data is being loaded and preventing the UI from appearing unresponsive while waiting for the data to load.
    const [listError, setListError] = useState<string | null>(null); // This is the state that will hold any error messages that may occur while fetching the list of applications from the database, which will be used to display error messages to the user if the data fetching process fails for any reason. By tracking errors in a separate state variable, we can provide more informative feedback to the user and help them understand what went wrong if there are issues with fetching the data.
    const [form, setForm] = useState(emptyform); // This is the state that will hold the current values of the form fields for creating a new application, which will be used to track the user's input as they fill out the form. By using a state variable to manage the form data, we can easily update and access the form values when the user submits the form, allowing us to create a new application object based on the user's input and add it to the list of applications in the UI. The emptyform variable is an object that defines the initial values for each field in the form, which can help ensure that all fields are properly initialized and prevent issues with undefined values when managing the form state.
    const [filter, setFilter] = useState<ApplicationStatus | "All">("All"); // This is the state that will hold the current filter value for the list of applications, which will be used to track the user's selection for filtering the applications based on their status. By using a state variable to manage the filter value, we can easily update and access the selected filter when rendering the list of applications, allowing us to conditionally display only the applications that match the selected status or show all applications if the "All" filter is selected. The ApplicationStatus type is a union type that defines the possible values for the status field in an application object, which can help ensure that only valid status values are used when managing the filter state and rendering the list of applications.

    // Other functions:
    const refresh = useCallback(async () => {
        // This is the function that will be responsible for fetching the list of applications from the database and updating the application state with the fetched data. By using the useCallback hook, we can memoize this function and prevent unnecessary re-renders of any components that depend on it, which can help improve the performance of the application. The refresh function will typically involve making an API call to the backend to retrieve the list of applications, handling any loading or error states that may occur during the fetching process, and then updating the application state with the retrieved data to reflect any changes in the UI.
        setListError(null);
        try {
            // const rows = await supabase.from("applications").select("*");
            const rows = await fetchApplications(supabase);
            setApplications(rows);
            console.log("rows:", rows);
        } catch (err) {
            setListError(
            formatSupabaseError(err, "Could not load applications."),
            );
        } finally {
            setListLoading(false);
        }
    }, [supabase]); // By including supabase in the dependency array, we ensure that the refresh function is updated whenever the supabase client changes, which can help ensure that we are always using the most up-to-date version of the client when fetching data from the database.


    useEffect(() => {
        startTransition(() => {
            void refresh();
        });
    }, [refresh]); // By including refresh in the dependency array, we ensure that the effect is re-run whenever the refresh function changes, which can help ensure that we are always fetching the most up-to-date list of applications from the database whenever the refresh function is updated.


    //------

    const filtered = useMemo(() => {
        if (filter === "All") return application;
        return application.filter((a) => a.status === filter);
    }, [application, filter]);

    const sorted = useMemo(
        () =>
        [...filtered]
        .filter((a) => a.appliedOn !== null) // Remove null dates
        .sort(
            (a, b) =>
            new Date(b.appliedOn!).getTime() - new Date(a.appliedOn!).getTime(),
        ),
    [filtered],
    );
    
    // const sorted = useMemo(
    //     () =>
    //     [...filtered].sort(
    //         (a, b) =>
    //         new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime(),
    //     ),
    //     [filtered],
    // );

    const updateStatus = useCallback(
        async (id: string, status: ApplicationStatus) => {
        setListError(null);
        const { error } = await supabase
            .from("applications")
            .update({ status })
            .eq("id", id);
        if (error) {
            setListError(
            formatSupabaseError(error, "Could not update application status."),
            );
            return;
        }
        await refresh();
        },
        [supabase, refresh],
    );

    const countsByStatus = useMemo(() => {
        const c = new Map<ApplicationStatus | "All", number>();
        c.set("All", application.length);
        for (const s of APPLICATION_STATUSES) {
        c.set(s, application.filter((a) => a.status === s).length);
        }
        return c;
    }, [application]);


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

            {/* Now to actually implement submitting something to the db */}

                {/* THIS IS JUST TESTING IF IT WILL FETCH AND DISPLAY */}

          <ul className="space-y-3">
            {sorted.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-medium text-zinc-900 dark:text-zinc-50">
                      {app.company}
                    </p>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {app.role}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {app.appliedOn ? (
                      <span>
                        Applied{" "}
                        {new Date(app.appliedOn + "T12:00:00").toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    ) : null}
                  </div>
                  {app.notes ? (
                    <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                      {app.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <label className="block w-full sm:w-40">
                    <span className="sr-only">Update status</span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        void updateStatus(
                          app.id,
                          e.target.value as ApplicationStatus,
                        )
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                </div>
              </li>
            ))}
          </ul>

                {/* THIS IS JUST TESTING IF IT WILL FETCH AND DISPLAY */}
        </div>
    );
}