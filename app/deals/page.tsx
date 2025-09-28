import { createClient } from "@/lib/supabase/server";
import DealsClient from "./deals-client";

export default async function DealsPage() {
  const supabase = createClient();
  const { data: deals, error } = await (await supabase).from("deals").select(`
    *,
    contacts (*)
  `);

  if (error) {
    console.error("Error fetching deals:", error);
    // Handle the error appropriately
  }

  return <DealsClient initialDeals={deals || []} />;
}
