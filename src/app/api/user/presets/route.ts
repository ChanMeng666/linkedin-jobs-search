import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { db, searchPresets, users } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

/**
 * GET /api/user/presets
 * Get all search presets for the authenticated user
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

    const presets = await db
      .select()
      .from(searchPresets)
      .where(eq(searchPresets.userId, user.id))
      .orderBy(desc(searchPresets.createdAt));

    return NextResponse.json({
      success: true,
      count: presets.length,
      presets,
    });
  } catch (error) {
    console.error('Get presets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get presets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/presets
 * Create a new search preset
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

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Preset name is required' },
        { status: 400 }
      );
    }

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

    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(searchPresets)
        .set({ isDefault: false })
        .where(eq(searchPresets.userId, user.id));
    }

    // Create the preset
    const [newPreset] = await db
      .insert(searchPresets)
      .values({
        userId: user.id,
        name: body.name,
        description: body.description || null,
        keyword: body.keyword || null,
        location: body.location || null,
        country: body.country || null,
        jobType: body.jobType || null,
        experienceLevel: body.experienceLevel || null,
        salary: body.salary || null,
        remoteFilter: body.remoteFilter || null,
        dateSincePosted: body.dateSincePosted || null,
        sortBy: body.sortBy || null,
        isDefault: body.isDefault || false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Preset created successfully',
      preset: newPreset,
    });
  } catch (error) {
    console.error('Create preset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create preset' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/presets
 * Update a search preset
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

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Preset ID is required' },
        { status: 400 }
      );
    }

    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(searchPresets)
        .set({ isDefault: false })
        .where(eq(searchPresets.userId, user.id));
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // Only update provided fields
    const fields = ['name', 'description', 'keyword', 'location', 'country',
                    'jobType', 'experienceLevel', 'salary', 'remoteFilter',
                    'dateSincePosted', 'sortBy', 'isDefault'];

    fields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const [updatedPreset] = await db
      .update(searchPresets)
      .set(updateData)
      .where(and(eq(searchPresets.id, body.id), eq(searchPresets.userId, user.id)))
      .returning();

    if (!updatedPreset) {
      return NextResponse.json(
        { success: false, error: 'Preset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Preset updated successfully',
      preset: updatedPreset,
    });
  } catch (error) {
    console.error('Update preset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preset' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/presets
 * Delete a search preset
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Preset ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(searchPresets)
      .where(and(eq(searchPresets.id, id), eq(searchPresets.userId, user.id)));

    return NextResponse.json({
      success: true,
      message: 'Preset deleted successfully',
    });
  } catch (error) {
    console.error('Delete preset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete preset' },
      { status: 500 }
    );
  }
}
