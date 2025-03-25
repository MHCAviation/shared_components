import type { Job } from "./types";

export async function fetchJobs(categoryId: number): Promise<Job[]> {
  const res = await fetch(
    `https://api.mhcaviation.com/category_vacancies?categoryId=${categoryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}
