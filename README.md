# Shared Components: Job Filter Component

A shared job filtering component library built for Next.js projects. It includes a responsive job filter with search functionality, dynamic filtering by aircraft type, and job card components that support custom client logos and schema.org structured data.

## Features

- **Dynamic Filtering:** Filter jobs by aircraft type extracted from the job title.
- **Search Functionality:** Search jobs by title, company, or description.
- **Responsive Design:** Utilizes Tailwind CSS for styling with responsive breakpoints.
- **Client Logo Integration:** Automatically fetches and displays client logos for job listings.
- **Structured Data:** Implements JobPosting schema for enhanced SEO.

## How to use

1. **Install the Package**

    Use npm or yarn to install the package into your Next.js project:

    ```bash
    npm install shared-components
    # or
    yarn add shared-components
    ```

2. **Peer Dependencies and Import**

    Ensure your project includes the following dependencies (or compatible versions):
    Next.js: ^14.0.0 or ^15.2.2+
    React: ^18.3.1 or ^19.0.0+

    Configure your dependency and add:
    ```bash
    "dependencies": {
    "shared-components": "git+https://github.com/MHCAviation/shared_components.git"
    // ... other dependencies
    }
    ```

    Example to import:
    ```bash
    import { FilterJob, fetchJobs } from "shared-components";
    #or
    import FilterJob from "shared-components/dist/FilterJob";
    import type { Job } from "shared-components/dist/utils/types";

    // Example job data and client IDs
    const jobs: Job[] = [
    // ... your job objects here
    ];

    const clientIds: number[] = [1, 2, 3];

    export default function JobsPage() {
    return <FilterJob jobs={jobs} clientIds={clientIds} />;}
    ```

3. **Component Overview**

    ## Filter Job Component
    Props:
    - jobs: Job[] – An array of job objects.
    - clientIds: number[] – An array of client IDs to fetch associated logos.

    ## Key Features
    - Extracts aircraft type from job titles.
    - Provides a search input for filtering jobs by title or description.
    - Updates URL parameters based on search and filter changes.
    - Renders a list of job cards with associated client logos.

    ## JobCard Component
    Props:
    - job: Job – Job object containing details such as JobTitle, PublishedJobDescription, etc.
    - clogoUrl: string – URL of the client logo.

    ## Key Features
    - Displays job title and a truncated description.
    - Utilizes responsive Tailwind CSS classes for adaptive layouts.
    - Includes structured data (JobPosting schema) for SEO.
    - Sends Google Tag Manager events upon clicking the job card.

4. **Tailwind CSS Considerations**

    Since the shared components use Tailwind CSS utility classes, ensure that the consuming project is set up correctly to avoid purging critical styles:

    ## Update Tailwind Config in The Consuming Project
    ```bash
    module.exports = {
    content: [
        "./node_modules/shared-components/dist/**/*.{js,ts,jsx,tsx}",
    ],
    // ...other configuration options
    };
    ```

    ## Tailwind Version

    Ensure your project uses Tailwind CSS v3+

5. **Install and Building The Package**

    The package is written in TypeScript and compiles to the dist directory. To build the package, run:
    ```bash
    npm install
    # or
    npm run build
    ```

    This command compiles the TypeScript files and generates the appropriate type declarations in dist/index.d.ts.

6. **Contributing**

    Contributions is allowed internally! Please submit issues and pull requests via the repository's GitHub page. When contributing, ensure your changes are well-tested and conform to the project’s style guidelines.

7. **License**

    This project is proprietary only.