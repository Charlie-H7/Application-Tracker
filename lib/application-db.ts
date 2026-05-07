import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationType, ApplicationStatus } from "@/app/types/application";
// import type { Application, ApplicationStatus } from "../types/application";
// import { ApplicationStatus, ApplicationType } from "../types/application"
// import { APPLICATION_STATUSES } from "@/types/application";
// import { ApplicationStatus, ApplicationType } from "../types/application"
// import type { Application, ApplicationStatus } from "../types/application"


export type ApplicationRow = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: string;
  applied_on: string | null;
  link: string | null; // Assuming link can be null if the user doesn't want to specify it
  notes: string;
};

export function rowToApplication(row: ApplicationRow): ApplicationType {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status as ApplicationStatus,
    appliedOn: row.applied_on,
    link: row.link || "", // Provide a default empty string if link is null
    notes: row.notes,
  };
}

export async function fetchApplications(
  supabase: SupabaseClient,
): Promise<ApplicationType[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, company, role, status, applied_on, link, notes" // Explicitly select all fields needed to construct an ApplicationType object,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ApplicationRow[]).map(rowToApplication);
}
