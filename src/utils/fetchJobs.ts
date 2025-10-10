import type { Job } from "./types";

export async function fetchJobs(categoryId: number): Promise<Job[]> {
  const res = await fetch(
    `https://api.mhcaviation.com/category_vacancies?categoryId=${categoryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  data.sort((a: Job, b: Job) => {
    const aHasOpen = a.JobTitle.includes("Open");
    const bHasOpen = b.JobTitle.includes("Open");
    if (aHasOpen && !bHasOpen) return 1;
    if (!aHasOpen && bHasOpen) return -1;
    // Both have or don't have "Open", sort by CreatedOn descending (latest first)
    const aDate = new Date(a.CreatedOn);
    const bDate = new Date(b.CreatedOn);
    return bDate.getTime() - aDate.getTime();
  });
  return data;
}
