import { supabase } from "./supabase";
import { Learning, Quote, Project, Curiosity } from "./types";

export async function getLearnings(): Promise<Learning[]> {
  const { data, error } = await supabase
    .from("learnings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching learnings:", error);
    return [];
  }
  return data || [];
}

export async function getQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
  return data || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data || [];
}

export async function getCuriosities(): Promise<Curiosity[]> {
  const { data, error } = await supabase
    .from("curiosities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching curiosities:", error);
    return [];
  }
  return data || [];
}
