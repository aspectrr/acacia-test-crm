import { createClient } from "@/lib/supabase/server";
import ContactsClient from "./contacts-client";

export default async function ContactsPage() {
  const supabase = createClient();
  const { data: contacts, error } = await (await supabase)
    .from("contacts")
    .select();

  if (error) {
    console.error("Error fetching contacts:", error);
    // Handle the error appropriately
  }

  return <ContactsClient initialContacts={contacts || []} />;
}
