import "../styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { sendGTMEvent } from "@next/third-parties/google"; // Adjust import as needed
import type { Job } from "../utils/types";

interface JobCardProps {
  job: Job;
  logoUrl: string;
}

export default function JobCard({ job, logoUrl }: JobCardProps) {
  const truncateDescription = (description: string, maxLength: number) =>
    description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;

  // Derive partner's company name from Category
  const partnersCompany = `${job.Category.split(" ")[0]}`;

  // Schema.org JobPosting structured data
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.JobTitle,
    description: job.PublishedJobDescription,
    datePosted: job.CreatedOn,
    hiringOrganization: {
      "@type": "Organization",
      name: partnersCompany,
      logo: logoUrl,
    },
    employmentType: job.EmploymentType,
    jobLocation: {
      "@type": "Place",
      address: job.JobLocation || "Global",
    },
  };

  return (
    <>
      <Link
        href={`https://portal.first2resource.com/Secure/Membership/Registration/JobDetails.aspx?JobId=${job.JobId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 border rounded-lg mb-4 block hover:bg-gray-50 transition-colors"
        onClick={() =>
          sendGTMEvent({
            event: "jobCardClick",
            jobId: job.JobId,
            jobTitle: job.JobTitle,
          })
        }
      >
        <div className="flex md:flex-row flex-col space-x-4 gap-4">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={partnersCompany}
              width={120}
              height={64}
              className="object-contain p-2 border rounded-lg bg-white"
            />
          )}
          <div className="flex flex-col gap-2 m-0">
            <h2 className="font-medium text-2xl">{job.JobTitle}</h2>
            <p className="text-gray-600">
              <span className="block sm:hidden">
                {truncateDescription(job.PublishedJobDescription, 80)}
              </span>
              <span className="hidden sm:block md:hidden">
                {truncateDescription(job.PublishedJobDescription, 150)}
              </span>
              <span className="hidden md:block">
                {truncateDescription(job.PublishedJobDescription, 200)}
              </span>
            </p>
          </div>
        </div>
      </Link>

      <Script
        id="jobPostingSchema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
    </>
  );
}
