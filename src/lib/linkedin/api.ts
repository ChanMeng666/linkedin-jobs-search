/**
 * LinkedIn Jobs Service
 * Business logic layer for LinkedIn job search operations
 */

import linkedIn from 'linkedin-jobs-api';

// LinkedIn hosts for multi-country search
export const LINKEDIN_HOSTS: Record<string, { host: string; name: string; flag: string }> = {
  'us': { host: 'www.linkedin.com', name: 'United States', flag: '🇺🇸' },
  'uk': { host: 'uk.linkedin.com', name: 'United Kingdom', flag: '🇬🇧' },
  'ca': { host: 'ca.linkedin.com', name: 'Canada', flag: '🇨🇦' },
  'in': { host: 'in.linkedin.com', name: 'India', flag: '🇮🇳' },
  'au': { host: 'au.linkedin.com', name: 'Australia', flag: '🇦🇺' },
  'de': { host: 'de.linkedin.com', name: 'Germany', flag: '🇩🇪' },
  'fr': { host: 'fr.linkedin.com', name: 'France', flag: '🇫🇷' },
  'sg': { host: 'sg.linkedin.com', name: 'Singapore', flag: '🇸🇬' },
  'jp': { host: 'jp.linkedin.com', name: 'Japan', flag: '🇯🇵' },
  'br': { host: 'br.linkedin.com', name: 'Brazil', flag: '🇧🇷' },
  'nl': { host: 'nl.linkedin.com', name: 'Netherlands', flag: '🇳🇱' },
  'es': { host: 'es.linkedin.com', name: 'Spain', flag: '🇪🇸' },
};

// Default values
const DEFAULTS = {
  LIMIT: '10',
  PAGE: '0',
};

export interface SearchParams {
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
  has_verification?: boolean | string;
  under_10_applicants?: boolean | string;
  country?: string;
}

export interface Job {
  position: string;
  company: string;
  location: string;
  date: string;
  agoTime: string;
  salary: string;
  jobUrl: string;
  companyLogo?: string;
  companyUrl?: string;
  description?: string;
  jobType?: string;
  country?: string;
  countryName?: string;
}

export interface SearchResult {
  success: boolean;
  count?: number;
  jobs?: Job[];
  searchParams?: Record<string, unknown>;
  error?: string;
}

/**
 * Build query options from request parameters
 */
export function buildQueryOptions(params: SearchParams) {
  const {
    keyword,
    location,
    dateSincePosted,
    jobType,
    remoteFilter,
    salary,
    experienceLevel,
    sortBy,
    limit,
    page,
    has_verification,
    under_10_applicants,
    country,
  } = params;

  // Get host from country code
  const hostConfig = country && LINKEDIN_HOSTS[country]
    ? LINKEDIN_HOSTS[country]
    : LINKEDIN_HOSTS['us'];

  return {
    keyword,
    location,
    dateSincePosted,
    jobType,
    remoteFilter,
    salary,
    experienceLevel,
    sortBy,
    limit: limit || DEFAULTS.LIMIT,
    page: page || DEFAULTS.PAGE,
    has_verification: has_verification === true || has_verification === 'true',
    under_10_applicants: under_10_applicants === true || under_10_applicants === 'true',
    host: hostConfig.host,
  };
}

/**
 * Search jobs with given options
 */
export async function searchJobs(queryOptions: ReturnType<typeof buildQueryOptions>): Promise<SearchResult> {
  try {
    // Use queryOptions directly (defaults already set in buildQueryOptions)
    const options = { ...queryOptions };

    // Remove empty values
    Object.keys(options).forEach((key) => {
      const value = options[key as keyof typeof options];
      if (!value && value !== false) {
        delete options[key as keyof typeof options];
      }
    });

    // Execute search
    const jobs = await linkedIn.query(options);

    return {
      success: true,
      count: jobs.length,
      jobs,
      searchParams: options,
    };
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    throw new Error(`LinkedIn API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search jobs across multiple countries
 */
export async function searchMultipleCountries(params: SearchParams, countryCodes: string[]): Promise<{
  success: boolean;
  totalCount: number;
  jobs: Job[];
  byCountry: Record<string, { name: string; count: number; jobs: Job[] }>;
}> {
  const results = await Promise.all(
    countryCodes.map(async (country) => {
      try {
        const queryOptions = buildQueryOptions({ ...params, country });
        const result = await searchJobs(queryOptions);
        return {
          country,
          countryName: LINKEDIN_HOSTS[country]?.name || country,
          ...result,
        };
      } catch (error) {
        console.error(`Failed to search in ${country}:`, error);
        return {
          country,
          countryName: LINKEDIN_HOSTS[country]?.name || country,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          jobs: [] as Job[],
        };
      }
    })
  );

  // Aggregate results
  const allJobs = results.flatMap((r) =>
    (r.jobs || []).map((job) => ({ ...job, country: r.country, countryName: r.countryName }))
  );

  return {
    success: true,
    totalCount: allJobs.length,
    jobs: allJobs,
    byCountry: results.reduce((acc, r) => {
      acc[r.country] = {
        name: r.countryName,
        count: r.jobs?.length || 0,
        jobs: r.jobs || [],
      };
      return acc;
    }, {} as Record<string, { name: string; count: number; jobs: Job[] }>),
  };
}

/**
 * Get available countries for multi-country search
 */
export function getAvailableCountries() {
  return Object.entries(LINKEDIN_HOSTS).map(([code, config]) => ({
    code,
    name: config.name,
    flag: config.flag,
  }));
}
