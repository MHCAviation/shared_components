import Link from "next/link";
import Script from "next/script";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Job } from "../utils/types";

interface JobCardProps {
  job: Job;
  logoUrl: string;
  logoPriority?: boolean;
}

export default function JobCard({ job, logoUrl, logoPriority }: JobCardProps) {
  const truncateDescription = (
    description: string | null,
    maxLength: number
  ) => {
    if (!description) return "";
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  // Derive partner's company name from Category (handle if Category is missing)
  const partnersCompany = job.Category ? job.Category.split(" ")[0] : "Company";
  const clientName = job.ClientName || partnersCompany;
  const logoAlt = `${clientName} logo image`;

  const portalDomain = process.env.NEXT_PUBLIC_PORTAL_DOMAIN || "portal.first2resource.com";
  const portalUrl = `https://${portalDomain}`;
  const jobUrl = `${portalUrl}/Secure/Membership/Registration/JobDetails.aspx?JobId=${job.JobId}`;

  // Schema.org JobPosting structured data
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.JobTitle,
    description: job.PublishedJobDescription || "",
    datePosted: job.CreatedOn,
    validThrough: job.StatusDate || job.StartDate || job.CreatedOn,
    employmentType: job.EmploymentType?.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name: clientName,
      ...(job.Company ? { sameAs: job.Company } : {}),
      ...(logoUrl ? { logo: logoUrl } : {}),
    },
    identifier: {
      "@type": "PropertyValue",
      name: "JobRefNo",
      value: job.JobRefNo,
    },
    directApply: true,
    industry: "Aviation",
    url: jobUrl,
  };

  return (
    <>
      <Link
        href={jobUrl}
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
            <img
              src={logoUrl}
              alt={logoAlt}
              width={120}
              height={64}
              loading={logoPriority ? "eager" : "lazy"}
              fetchPriority={logoPriority ? "high" : "auto"}
              className="object-contain p-2 border rounded-lg bg-white"
            />
          )}
          <div className="flex flex-col gap-2 m-0">
            <p className="text-sm text-gray-600">{clientName}</p>
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
        id={`jobPostingSchema-${job.JobId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
    </>
  );
}
