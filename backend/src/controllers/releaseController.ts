import { Context } from 'hono';
import { db } from '../database/db';
import { releases } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateReleaseDto, UpdateReleaseDto } from '../types/release.types';

// Get all releases
export const getAllReleases = async (c: Context) => {
  try {
    const allReleases = await db
      .select()
      .from(releases)
      .orderBy(desc(releases.releaseDate), desc(releases.createdAt));
    
    return c.json({
      success: true,
      data: allReleases,
      count: allReleases.length
    });
  } catch (error) {
    console.error('Error fetching releases:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch releases'
    }, 500);
  }
};

// Get single release by ID
export const getReleaseById = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const release = await db
      .select()
      .from(releases)
      .where(eq(releases.id, parseInt(id)))
      .limit(1);
    
    if (release.length === 0) {
      return c.json({
        success: false,
        error: 'Release not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: release[0]
    });
  } catch (error) {
    console.error('Error fetching release:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch release'
    }, 500);
  }
};

// Create new release
export const createRelease = async (c: Context) => {
  try {
    const { releaseName, version, releaseDate, remarks, checklist, checklistProgress }: CreateReleaseDto = await c.req.json();
    
    const newRelease = await db
      .insert(releases)
      .values({
        releaseName,
        version,
        releaseDate,
        remarks: remarks || null,
        checklist,
        checklistProgress
      })
      .returning();
    
    return c.json({
      success: true,
      data: newRelease[0],
      message: 'Release created successfully'
    }, 201);
  } catch (error) {
    console.error('Error creating release:', error);
    return c.json({
      success: false,
      error: 'Failed to create release'
    }, 500);
  }
};

// Update release
export const updateRelease = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const updateData: UpdateReleaseDto = await c.req.json();
    
    // Build update object with only defined fields
    const updateValues: any = {};
    
    if (updateData.releaseName !== undefined) updateValues.releaseName = updateData.releaseName;
    if (updateData.version !== undefined) updateValues.version = updateData.version;
    if (updateData.releaseDate !== undefined) updateValues.releaseDate = updateData.releaseDate;
    if (updateData.remarks !== undefined) updateValues.remarks = updateData.remarks;
    if (updateData.checklist !== undefined) updateValues.checklist = updateData.checklist;
    if (updateData.checklistProgress !== undefined) updateValues.checklistProgress = updateData.checklistProgress;
    
    if (Object.keys(updateValues).length === 0) {
      return c.json({
        success: false,
        error: 'No fields to update'
      }, 400);
    }
    
    const updatedRelease = await db
      .update(releases)
      .set(updateValues)
      .where(eq(releases.id, parseInt(id)))
      .returning();
    
    if (updatedRelease.length === 0) {
      return c.json({
        success: false,
        error: 'Release not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: updatedRelease[0],
      message: 'Release updated successfully'
    });
  } catch (error) {
    console.error('Error updating release:', error);
    return c.json({
      success: false,
      error: 'Failed to update release'
    }, 500);
  }
};

// Delete release
export const deleteRelease = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const deletedRelease = await db
      .delete(releases)
      .where(eq(releases.id, parseInt(id)))
      .returning();
    
    if (deletedRelease.length === 0) {
      return c.json({
        success: false,
        error: 'Release not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Release deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting release:', error);
    return c.json({
      success: false,
      error: 'Failed to delete release'
    }, 500);
  }
};
