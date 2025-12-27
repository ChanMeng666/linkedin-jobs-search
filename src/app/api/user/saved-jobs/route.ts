import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { db, savedJobs, users } from '@/lib/db';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * GET /api/user/saved-jobs
 * Get all saved jobs for the authenticated user
 */
export async function GET() {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jobs = await db
      .select()
      .from(savedJobs)
      .where(eq(savedJobs.userId, user.id))
      .orderBy(desc(savedJobs.createdAt));

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get saved jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/saved-jobs
 * Save a job for the authenticated user
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

    // Ensure user exists in our database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (existingUser.length === 0) {
      // Create user if not exists
      await db.insert(users).values({
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || null,
        avatarUrl: user.profileImageUrl || null,
        provider: 'oauth',
      });
    }

    // Extract job ID from URL
    const jobId = body.jobUrl?.match(/(\d+)/)?.[1] || body.jobId;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, user.id), eq(savedJobs.jobId, jobId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Job already saved',
        job: existing[0],
      });
    }

    // Save the job
    const [newJob] = await db
      .insert(savedJobs)
      .values({
        userId: user.id,
        jobId,
        position: body.position || 'Unknown Position',
        company: body.company || 'Unknown Company',
        location: body.location || null,
        salary: body.salary || null,
        jobUrl: body.jobUrl || '',
        companyLogo: body.companyLogo || null,
        jobType: body.jobType || null,
        agoTime: body.agoTime || null,
        notes: body.notes || null,
        status: 'saved',
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Job saved successfully',
      job: newJob,
    });
  } catch (error) {
    console.error('Save job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save job' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/saved-jobs
 * Update a saved job's status or notes
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      if (status === 'applied') {
        updateData.appliedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const [updatedJob] = await db
      .update(savedJobs)
      .set(updateData)
      .where(and(eq(savedJobs.id, id), eq(savedJobs.userId, user.id)))
      .returning();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Update saved job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/saved-jobs
 * Delete a saved job
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.id, jobId), eq(savedJobs.userId, user.id)));

    return NextResponse.json({
      success: true,
      message: 'Job removed successfully',
    });
  } catch (error) {
    console.error('Delete saved job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
