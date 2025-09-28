import { createClient } from "@/lib/supabase/server";
import TasksClient from "./tasks-client";

export default async function TasksPage() {
  const supabase = createClient();
  const { data: tasks, error } = await (await supabase).from("tasks").select(`
    *,
    contacts (*),
    deals (*)
  `);

  if (error) {
    console.error("Error fetching tasks:", error);
    // Handle the error appropriately
  }

  return <TasksClient initialTasks={tasks || []} />;
}
