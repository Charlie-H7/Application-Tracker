export const APPLICATION_STATUSES = [
  "Wishlist",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationType = {
    id: string;
    company: string;
    role: string;
    status: ApplicationStatus;
    appliedOn: string | null; // Date can be null if the user doesn't want to specify it
    link: string;
    notes?: string; // Optional field for comments
}