import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { db, searchHistory, users } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

/**
 * GET /api/user/search-history
 * Get search history for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const history = await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, user.id))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error('Get search history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get search history' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/search-history
 * Save a search to history
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
      await db.insert(users).values({
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || null,
        avatarUrl: user.profileImageUrl || null,
        provider: 'oauth',
      });
    }

    // Save search history
    const [newHistory] = await db
      .insert(searchHistory)
      .values({
        userId: user.id,
        keyword: body.keyword || null,
        location: body.location || null,
        country: body.country || null,
        jobType: body.jobType || null,
        experienceLevel: body.experienceLevel || null,
        salary: body.salary || null,
        remoteFilter: body.remoteFilter || null,
        dateSincePosted: body.dateSincePosted || null,
        sortBy: body.sortBy || null,
        resultsCount: body.resultsCount || null,
        searchParams: body,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Search saved to history',
      history: newHistory,
    });
  } catch (error) {
    console.error('Save search history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save search history' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/search-history
 * Clear search history
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
    const id = searchParams.get('id');

    if (id) {
      // Delete specific entry
      await db
        .delete(searchHistory)
        .where(and(eq(searchHistory.id, id), eq(searchHistory.userId, user.id)));
    } else {
      // Clear all history
      await db
        .delete(searchHistory)
        .where(eq(searchHistory.userId, user.id));
    }

    return NextResponse.json({
      success: true,
      message: 'Search history cleared',
    });
  } catch (error) {
    console.error('Delete search history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete search history' },
      { status: 500 }
    );
  }
}
