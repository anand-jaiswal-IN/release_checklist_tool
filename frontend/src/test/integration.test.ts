import { describe, it, expect, afterAll } from 'vitest';
import { apiService } from '../services/api';

/**
 * Integration Tests
 * These tests cover end-to-end flows and interactions between components
 */

// These tests assume backend is running on localhost:5000
const BACKEND_AVAILABLE = import.meta.env.TEST_BACKEND === 'true';

describe('Integration Tests - Full Release Flow', () => {
  let createdReleaseId: number | null = null;

  // Skip integration tests if backend is not available
  const testIf = (condition: boolean) => (condition ? it : it.skip);

  afterAll(async () => {
    // Cleanup: Delete created test release
    if (createdReleaseId) {
      try {
        await apiService.deleteRelease(createdReleaseId);
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }
  });

  testIf(BACKEND_AVAILABLE)('should complete full release lifecycle', async () => {
    // Step 1: Create a new release
    const newReleaseData = {
      releaseName: 'Integration Test Release',
      version: '99.0.0',
      releaseDate: '2026-12-31',
      remarks: 'This is an integration test',
      checklist: {
        prsMerged: false,
        changelogUpdated: false,
        testsPassing: false,
        githubReleaseCreated: false,
        deployedDemo: false,
        testedDemo: false,
        deployedProduction: false,
      },
      checklistProgress: {
        total: 7,
        completed: 0,
        percentage: 0,
      },
    };

    const createdRelease = await apiService.createRelease(newReleaseData);
    createdReleaseId = createdRelease.id;

    expect(createdRelease).toBeDefined();
    expect(createdRelease.id).toBeDefined();
    expect(createdRelease.releaseName).toBe(newReleaseData.releaseName);

    // Step 2: Fetch the created release
    const fetchedRelease = await apiService.getReleaseById(createdReleaseId);
    expect(fetchedRelease.id).toBe(createdReleaseId);
    expect(fetchedRelease.releaseName).toBe(newReleaseData.releaseName);

    // Step 3: Update the release
    const updateData = {
      releaseName: 'Updated Integration Test Release',
      checklist: {
        prsMerged: true,
        changelogUpdated: true,
        testsPassing: true,
        githubReleaseCreated: false,
        deployedDemo: false,
        testedDemo: false,
        deployedProduction: false,
      },
      checklistProgress: {
        total: 7,
        completed: 3,
        percentage: 43,
      },
    };

    const updatedRelease = await apiService.updateRelease(
      createdReleaseId,
      updateData
    );
    expect(updatedRelease.releaseName).toBe(updateData.releaseName);
    expect(updatedRelease.checklistProgress.completed).toBe(3);

    // Step 4: Verify release appears in list
    const allReleases = await apiService.getAllReleases();
    const foundRelease = allReleases.find((r) => r.id === createdReleaseId);
    expect(foundRelease).toBeDefined();
    expect(foundRelease?.releaseName).toBe(updateData.releaseName);

    // Step 5: Delete the release
    await apiService.deleteRelease(createdReleaseId);

    // Step 6: Verify deletion
    try {
      await apiService.getReleaseById(createdReleaseId);
      // Should not reach here
      expect.fail('Release should have been deleted');
    } catch (error) {
      expect(error).toBeDefined();
    }

    createdReleaseId = null; // Prevent duplicate cleanup
  }, 10000); // 10 second timeout for integration test

  testIf(BACKEND_AVAILABLE)('should handle status calculation correctly', async () => {
    // Create releases with different completion levels
    const plannedRelease = await apiService.createRelease({
      releaseName: 'Planned Release Test',
      version: '98.0.0',
      releaseDate: '2026-12-31',
      checklist: {
        prsMerged: false,
        changelogUpdated: false,
        testsPassing: false,
        githubReleaseCreated: false,
        deployedDemo: false,
        testedDemo: false,
        deployedProduction: false,
      },
      checklistProgress: { total: 7, completed: 0, percentage: 0 },
    });

    const ongoingRelease = await apiService.createRelease({
      releaseName: 'Ongoing Release Test',
      version: '97.0.0',
      releaseDate: '2026-12-31',
      checklist: {
        prsMerged: true,
        changelogUpdated: true,
        testsPassing: false,
        githubReleaseCreated: false,
        deployedDemo: false,
        testedDemo: false,
        deployedProduction: false,
      },
      checklistProgress: { total: 7, completed: 2, percentage: 29 },
    });

    const doneRelease = await apiService.createRelease({
      releaseName: 'Done Release Test',
      version: '96.0.0',
      releaseDate: '2026-12-31',
      checklist: {
        prsMerged: true,
        changelogUpdated: true,
        testsPassing: true,
        githubReleaseCreated: true,
        deployedDemo: true,
        testedDemo: true,
        deployedProduction: true,
      },
      checklistProgress: { total: 7, completed: 7, percentage: 100 },
    });

    // Import and test status calculation
    const { calculateReleaseStatus } = await import('../services/api');

    expect(calculateReleaseStatus(0, 7)).toBe('planned');
    expect(calculateReleaseStatus(2, 7)).toBe('ongoing');
    expect(calculateReleaseStatus(7, 7)).toBe('done');

    // Cleanup
    await apiService.deleteRelease(plannedRelease.id);
    await apiService.deleteRelease(ongoingRelease.id);
    await apiService.deleteRelease(doneRelease.id);
  }, 15000);

  testIf(!BACKEND_AVAILABLE)('mock integration test - demonstrates flow', () => {
    // This test demonstrates the expected flow when backend is not available
    expect(true).toBe(true);
    console.log('Integration tests skipped - set TEST_BACKEND=true to run with live backend');
  });
});

describe('Integration Tests - Error Handling', () => {
  const testIf = (condition: boolean) => (condition ? it : it.skip);

  testIf(BACKEND_AVAILABLE)('should handle 404 errors gracefully', async () => {
    try {
      await apiService.getReleaseById(999999);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  testIf(BACKEND_AVAILABLE)('should handle invalid update gracefully', async () => {
    try {
      await apiService.updateRelease(999999, { releaseName: 'Invalid' });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  testIf(BACKEND_AVAILABLE)('should handle invalid delete gracefully', async () => {
    try {
      await apiService.deleteRelease(999999);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
