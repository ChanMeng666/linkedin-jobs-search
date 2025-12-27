import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { db, savedJobs } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

/**
 * POST /api/export
 * Export saved jobs to CSV or JSON
 */
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const format = body.format || 'csv';
    const jobs = body.jobs;

    // If jobs are provided in request, use them; otherwise fetch from DB
    let dataToExport = jobs;

    if (!dataToExport || dataToExport.length === 0) {
      const userJobs = await db
        .select()
        .from(savedJobs)
        .where(eq(savedJobs.userId, user.id))
        .orderBy(desc(savedJobs.createdAt));

      dataToExport = userJobs;
    }

    if (!dataToExport || dataToExport.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data to export' },
        { status: 400 }
      );
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = ['Position', 'Company', 'Location', 'Salary', 'Status', 'Job URL', 'Notes', 'Saved At'];
      const rows = dataToExport.map((job: Record<string, unknown>) => [
        escapeCsvField(job.position as string || ''),
        escapeCsvField(job.company as string || ''),
        escapeCsvField(job.location as string || ''),
        escapeCsvField(job.salary as string || ''),
        escapeCsvField(job.status as string || 'saved'),
        escapeCsvField(job.jobUrl as string || ''),
        escapeCsvField(job.notes as string || ''),
        job.createdAt ? new Date(job.createdAt as string).toLocaleDateString() : '',
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="saved-jobs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format === 'json') {
      // Return JSON
      return new NextResponse(JSON.stringify(dataToExport, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="saved-jobs-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Use "csv" or "json"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

/**
 * Escape special characters for CSV
 */
function escapeCsvField(field: string): string {
  if (!field) return '';
  // If field contains comma, newline, or quote, wrap in quotes
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
