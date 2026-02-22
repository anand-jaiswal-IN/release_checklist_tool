import { describe, test, expect, afterAll } from "bun:test";
import { db } from "../database/db";
import { releases } from "../database/schema";
import { eq } from "drizzle-orm";

describe("Database Operations", () => {
  let testReleaseId: number;

  const testData = {
    releaseName: "Database Test Release",
    version: "1.0.0",
    releaseDate: "2026-03-01",
    remarks: "Testing database operations",
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

  afterAll(async () => {
    // Cleanup
    if (testReleaseId) {
      await db.delete(releases).where(eq(releases.id, testReleaseId));
    }
  });

  describe("INSERT Operations", () => {
    test("should insert a new release", async () => {
      const [result] = await db.insert(releases).values(testData).returning();

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.releaseName).toBe(testData.releaseName);
      expect(result.version).toBe(testData.version);
      expect(result.checklist).toEqual(testData.checklist);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      testReleaseId = result.id;
    });

    test("should set default values for JSONB fields", async () => {
      const minimalData = {
        releaseName: "Minimal Release",
        version: "0.1.0",
        releaseDate: "2026-03-02",
      };

      const [result] = await db.insert(releases).values(minimalData as any).returning();

      expect(result.checklist).toBeDefined();
      expect(result.checklistProgress).toBeDefined();

      // Cleanup
      await db.delete(releases).where(eq(releases.id, result.id));
    });
  });

  describe("SELECT Operations", () => {
    test("should select all releases", async () => {
      const results = await db.select().from(releases);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should select release by ID", async () => {
      const [result] = await db
        .select()
        .from(releases)
        .where(eq(releases.id, testReleaseId));

      expect(result).toBeDefined();
      expect(result.id).toBe(testReleaseId);
    });

    test("should return empty array for non-existent ID", async () => {
      const results = await db
        .select()
        .from(releases)
        .where(eq(releases.id, 999999));

      expect(results).toEqual([]);
    });
  });

  describe("UPDATE Operations", () => {
    test("should update release fields", async () => {
      const updateData = {
        releaseName: "Updated Database Test Release",
        version: "1.1.0",
      };

      const [result] = await db
        .update(releases)
        .set(updateData)
        .where(eq(releases.id, testReleaseId))
        .returning();

      expect(result.releaseName).toBe(updateData.releaseName);
      expect(result.version).toBe(updateData.version);
    });

    test("should update JSONB checklist", async () => {
      const updatedChecklist = {
        prsMerged: true,
        changelogUpdated: true,
        testsPassing: true,
        githubReleaseCreated: false,
        deployedDemo: false,
        testedDemo: false,
        deployedProduction: false,
      };

      const [result] = await db
        .update(releases)
        .set({ checklist: updatedChecklist })
        .where(eq(releases.id, testReleaseId))
        .returning();

      expect(result.checklist).toEqual(updatedChecklist);
    });

    test("should update progress tracking", async () => {
      const updatedProgress = {
        total: 7,
        completed: 3,
        percentage: 43,
      };

      const [result] = await db
        .update(releases)
        .set({ checklistProgress: updatedProgress })
        .where(eq(releases.id, testReleaseId))
        .returning();

      expect(result.checklistProgress).toEqual(updatedProgress);
    });
  });

  describe("DELETE Operations", () => {
    test("should delete release by ID", async () => {
      // Create a temporary release to delete
      const [tempRelease] = await db
        .insert(releases)
        .values({
          releaseName: "Temp Delete Release",
          version: "9.9.9",
          releaseDate: "2026-03-01",
          checklist: testData.checklist,
          checklistProgress: testData.checklistProgress,
        })
        .returning();

      // Delete it
      const [deleted] = await db
        .delete(releases)
        .where(eq(releases.id, tempRelease.id))
        .returning();

      expect(deleted.id).toBe(tempRelease.id);

      // Verify deletion
      const [result] = await db
        .select()
        .from(releases)
        .where(eq(releases.id, tempRelease.id));

      expect(result).toBeUndefined();
    });
  });

  describe("Data Integrity", () => {
    test("should preserve JSONB structure", async () => {
      const [result] = await db
        .select()
        .from(releases)
        .where(eq(releases.id, testReleaseId));

      expect(typeof result.checklist).toBe("object");
      expect(typeof result.checklistProgress).toBe("object");

      expect(result.checklist).toHaveProperty("prsMerged");
      expect(result.checklist).toHaveProperty("changelogUpdated");
      expect(result.checklistProgress).toHaveProperty("total");
      expect(result.checklistProgress).toHaveProperty("completed");
      expect(result.checklistProgress).toHaveProperty("percentage");
    });

    test("should handle null remarks", async () => {
      const [updated] = await db
        .update(releases)
        .set({ remarks: null })
        .where(eq(releases.id, testReleaseId))
        .returning();

      expect(updated.remarks).toBeNull();
    });
  });
});
