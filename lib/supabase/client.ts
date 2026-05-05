// import { SupabaseClient } from "@supabase/supabase-js";
// import { createClient } from "@/lib/supabase/server";
import { createBrowserClient } from "@supabase/ssr";

// Okay so from what I understand, this is browser client.
// Which means that this is reponsible for creating a cookie
export default function createBrowserSupabaseClient() {
      return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}