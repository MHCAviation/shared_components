"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Job } from "../utils/types";
import JobCard from "./JobCard";

type SortStrategy = "F2R" | "default";

interface FilterJobProps {
  jobs: Job[] | null;
  clientIds: number[];
  sortStrategy?: SortStrategy,
  LoadingComponent?: React.ReactNode; // Optional prop for a custom loading component
  ErrorComponent?: React.ReactNode; // Optional prop for a custom error component
}

// Extract the aircraft type from a job title
function getAircraftType(jobTitle: string): string {
  const title = jobTitle.toLowerCase();
  if (title.includes("saab")) return "Saab";
  if (title.includes("atr")) return "ATR";
  if (/\bb\d{3}\b/i.test(jobTitle)) return "Boeing"; // e.g. B737, B777, etc.
  if (/\ba\d{3}\b/i.test(jobTitle)) return "Airbus"; // e.g. A320, A330, etc.
  return "Other";
}

function sortJobsByClient(jobs: Job[]) {
    return [...jobs].sort((job1, job2) => {
        if (job1.ClientId !== job2.ClientId) {
            return job1.ClientId - job2.ClientId;
        }

        return new Date(job2.StartDate).getTime() - new Date(job1.StartDate).getTime();
    })
}

function sortJobsByOpenApplication(jobs: Job[]) {
    return [...jobs].sort((job1, job2) => {
        return +job1.JobRefNo.startsWith("OR") - +job2.JobRefNo.startsWith("OR");
    });
}

function defaultSorting(jobs: Job[]) {
    return sortJobsByOpenApplication(sortJobsByClient(jobs));
}

function f2rSorting(jobs: Job[]) {
    return [...jobs].sort((job1, job2) => {
        const priorityJob1 = CLIENT_ID_PRIORITY_MAP.get(job1.ClientId);
        const priorityJob2 = CLIENT_ID_PRIORITY_MAP.get(job2.ClientId);
        const startDateJob1 = new Date(job1.StartDate);
        const startDateJob2 = new Date(job2.StartDate);

        // explicit check for undefined since jobs index will be 0 not 1
        // we could map priorities to i + 1 but this will work fine as well I guess
        if (priorityJob1 !== undefined && priorityJob2 !== undefined) {
            if (priorityJob1 !== priorityJob2) {
                return priorityJob1 - priorityJob2;
            }

            return startDateJob2.getTime() - startDateJob1.getTime();
        }

        if (priorityJob1 !== undefined) {
            return -1
        }

        if (priorityJob2 !== undefined) {
            return 1;
        }

        return startDateJob2.getTime() - startDateJob1.getTime();
    });
}

const sorters: Record<SortStrategy, (jobs: Job[]) => Job[]> = {
    "F2R": f2rSorting,
    "default": defaultSorting,
};

const CLIENT_ID_PRIORITY_ORDER: number[] = [
    28068,
    41411,
    21791,
    14129,
    36255,
    40835,
    12927,
    13719,
    16196,
    436,
] as const;

const CLIENT_ID_PRIORITY_MAP = new Map(CLIENT_ID_PRIORITY_ORDER.map((id, i) => [id, i]));
/*
1. vietnam = 28068
2. sunexpress = 41411
3. electra = 21791
4. heston = 14129
5. airbaltic = 36255
6. B737 Engineers
7. Airest = 12927
8. Fleet = 13719
9. airline support baltic = 16196
10. avion = 436
11. openjobs

 */

export default function FilterJob({
  jobs,
  clientIds,
  sortStrategy = "default",
  LoadingComponent,
  ErrorComponent,
}: FilterJobProps) {
  // If jobs is not a valid array, render the error component or a default error message.
  if (!jobs || !Array.isArray(jobs)) {
    return (
      <div className="text-center py-10">
        {ErrorComponent ? ErrorComponent : "Sorry, no job available right now."}
      </div>
    );
  }

  // Read initial search term and filters from URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchTerm = searchParams.get("search") || "";
  const initialFilters = searchParams.get("filters")?.split(",") || [];

  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const clientLogoBaseUrl =
    "https://hiportal.eu/Secure/api/Job/GetClientLogoFromDb";
  const logos = useMemo(() => {
    return clientIds.reduce((acc, clientId) => {
      acc[clientId] = `${clientLogoBaseUrl}?clientId=${clientId}`;
      return acc;
    }, {} as Record<number, string>);
  }, [clientIds, clientLogoBaseUrl]);

  // Update URL when search term or filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedTypes.length > 0)
      params.set("filters", selectedTypes.join(","));
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, selectedTypes, router]);

  // List available aircraft types
  const aircraftTypes = Array.from(
    new Set(jobs.map((job) => getAircraftType(job.JobTitle)))
  );

  // Toggle a filter
  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter jobs based on the criteria
  const filteredJobs = jobs
    ?.filter(
      (job) =>
        selectedTypes.length === 0 ||
        selectedTypes.includes(getAircraftType(job.JobTitle))
    )
    ?.filter((job) =>
      searchTerm
        ? job.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.PublishedJobDescription.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        : true
    );

  const displayJobs = useMemo(() => {
      const sortingMethod = sorters[sortStrategy];
      return sortingMethod(filteredJobs);
  }, [filteredJobs]);

  return (
    <div className="mt-4">
      {/* Search Input */}
      <div className="sticky top-20 py-6 bg-white">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Search jobs by title, company, or description..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-gray-500">
            {searchTerm ? (
              <>
                Showing {filteredJobs.length} results for &quot;{searchTerm}
                &quot;
              </>
            ) : (
              `Showing ${filteredJobs.length} jobs`
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row my-4 gap-4">
        {/* Filters: Render only if not loading and matching jobs exist */}
        {filteredJobs.length > 0 && (
          <div className="basis-2/5 border border-gray-200 p-4 rounded-lg h-min lg:max-w-fit sticky top-48 lg:top-52 bg-white">
            <h3 className="text-lg font-medium mb-2">
              Filter by Aircraft Type
            </h3>
            <div className="flex lg:flex-col gap-4 flex-wrap">
              {aircraftTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    className="form-checkbox h-4 w-4 cursor-pointer"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="w-full flex justify-center items-center py-4">
            {ErrorComponent ? ErrorComponent : "No matching jobs found"}
          </div>
        ) : (
          <div className="space-y-4">
            {displayJobs.map((job, index) => (
              <JobCard
                key={job.JobId}
                job={job}
                logoUrl={logos[job.ClientId] || ""}
                logoPriority={index < 2}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
