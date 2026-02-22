import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateReleaseStatus } from '../api';

describe('API Service', () => {
  describe('calculateReleaseStatus', () => {
    it('should return "planned" when no tasks are completed', () => {
      expect(calculateReleaseStatus(0, 10)).toBe('planned');
    });

    it('should return "ongoing" when some tasks are completed', () => {
      expect(calculateReleaseStatus(5, 10)).toBe('ongoing');
      expect(calculateReleaseStatus(1, 10)).toBe('ongoing');
      expect(calculateReleaseStatus(9, 10)).toBe('ongoing');
    });

    it('should return "done" when all tasks are completed', () => {
      expect(calculateReleaseStatus(10, 10)).toBe('done');
      expect(calculateReleaseStatus(1, 1)).toBe('done');
    });

    it('should handle edge case with 0 total tasks', () => {
      // When there are 0 total tasks and 0 completed, it's still "planned"
      expect(calculateReleaseStatus(0, 0)).toBe('planned');
    });
  });

  describe('API Methods', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      global.fetch = vi.fn();
    });

    it('should have getAllReleases method', async () => {
      const { apiService } = await import('../api');
      expect(apiService.getAllReleases).toBeDefined();
      expect(typeof apiService.getAllReleases).toBe('function');
    });

    it('should have getReleaseById method', async () => {
      const { apiService } = await import('../api');
      expect(apiService.getReleaseById).toBeDefined();
      expect(typeof apiService.getReleaseById).toBe('function');
    });

    it('should have createRelease method', async () => {
      const { apiService } = await import('../api');
      expect(apiService.createRelease).toBeDefined();
      expect(typeof apiService.createRelease).toBe('function');
    });

    it('should have updateRelease method', async () => {
      const { apiService } = await import('../api');
      expect(apiService.updateRelease).toBeDefined();
      expect(typeof apiService.updateRelease).toBe('function');
    });

    it('should have deleteRelease method', async () => {
      const { apiService } = await import('../api');
      expect(apiService.deleteRelease).toBeDefined();
      expect(typeof apiService.deleteRelease).toBe('function');
    });
  });
});
