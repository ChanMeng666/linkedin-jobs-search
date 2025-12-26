import { NextRequest, NextResponse } from 'next/server';
import { searchJobs, buildQueryOptions, searchMultipleCountries, getAvailableCountries, type SearchParams } from '@/lib/linkedin/api';

/**
 * POST /api/jobs
 * Search for jobs with filters
 */
export async function POST(request: NextRequest) {
  try {
    const body: SearchParams & { countries?: string[] } = await request.json();

    // Multi-country search
    if (body.countries && Array.isArray(body.countries) && body.countries.length > 0) {
      const result = await searchMultipleCountries(body, body.countries);
      return NextResponse.json(result);
    }

    // Single country/default search
    const queryOptions = buildQueryOptions(body);
    const result = await searchJobs(queryOptions);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search jobs',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/jobs
 * Get available countries for multi-country search
 */
export async function GET() {
  try {
    const countries = getAvailableCountries();
    return NextResponse.json({
      success: true,
      countries,
    });
  } catch (error) {
    console.error('Get countries error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get countries',
      },
      { status: 500 }
    );
  }
}
