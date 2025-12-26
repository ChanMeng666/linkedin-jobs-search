declare module 'linkedin-jobs-api' {
  interface QueryOptions {
    keyword?: string;
    location?: string;
    dateSincePosted?: string;
    jobType?: string;
    remoteFilter?: string;
    salary?: string;
    experienceLevel?: string;
    sortBy?: string;
    limit?: string;
    page?: string;
    host?: string;
  }

  interface Job {
    position: string;
    company: string;
    companyLogo?: string;
    location: string;
    date: string;
    agoTime: string;
    salary: string;
    jobUrl: string;
    companyUrl?: string;
    description?: string;
  }

  interface LinkedInAPI {
    query: (options: QueryOptions) => Promise<Job[]>;
  }

  const linkedIn: LinkedInAPI;
  export default linkedIn;
}
