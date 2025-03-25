"use client";

import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Job } from "../utils/types";
import JobCard from "./JobCard";

interface FilterJobProps {
  jobs: Job[];
  clientIds: number[];
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

export default function FilterJob({ jobs, clientIds }: FilterJobProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial search term and filters from URL
  const initialSearchTerm = searchParams.get("search") || "";
  const initialFilters = searchParams.get("filters")?.split(",") || [];

  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [logos, setLogos] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch client logos
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const results = await Promise.all(
          clientIds.map(async (clientId) => {
            const response = await fetch(
              `/api/client-logo?clientId=${clientId}`
            );
            if (!response.ok) return { clientId, logo: "" };
            const data = await response.json();
            return { clientId, logo: data.logo || "" };
          })
        );
        const logoMap = results.reduce((acc, { clientId, logo }) => {
          acc[clientId] = logo;
          return acc;
        }, {} as Record<number, string>);
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogos();
  }, [clientIds]);

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
    .filter(
      (job) =>
        selectedTypes.length === 0 ||
        selectedTypes.includes(getAircraftType(job.JobTitle))
    )
    .filter((job) =>
      searchTerm
        ? job.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.PublishedJobDescription.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        : true
    );

  return (
    <div className="mt-4">
      {/* Search Input */}
      <div className="sticky top-16 py-6 bg-white">
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
        {/* Filters */}
        <div className="basis-2/5 border border-gray-200 p-4 rounded-lg max-h-fit lg:max-w-fit sticky top-44 lg:top-48 bg-white">
          <h3 className="text-lg font-medium mb-2">Filter by Aircraft Type</h3>
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

        {/* Job Listings */}
        {isLoading ? (
          <div className="w-full flex justify-start items-center">
            "loading jobs..."
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8">No matching jobs found</div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.JobId}
                job={job}
                logoUrl={logos[job.ClientId] || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
