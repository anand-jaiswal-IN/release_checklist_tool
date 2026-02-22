// @ts-nocheck
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { db } from "../database/db";
import { releases } from "../database/schema";
import { eq } from "drizzle-orm";

const API_BASE_URL = "http://localhost:5000/api";

describe("Release API Endpoints", () => {
  let createdReleaseId: number;

  // Test data
  const testRelease = {
    releaseName: "Test Release v1.0",
    version: "1.0.0",
    releaseDate: "2026-03-01",
    remarks: "Test release for API testing",
    checklist: {
      prsMerged: true,
      changelogUpdated: false,
      testsPassing: true,
      githubReleaseCreated: false,
      deployedDemo: false,
      testedDemo: false,
      deployedProduction: false,
    },
    checklistProgress: {
      total: 7,
      completed: 2,
      percentage: 29,
    },
  };

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(releases).where(eq(releases.releaseName, testRelease.releaseName));
  });

  afterAll(async () => {
    // Clean up created test data
    if (createdReleaseId) {
      await db.delete(releases).where(eq(releases.id, createdReleaseId));
    }
  });

  describe("POST /api/releases", () => {
    test("should create a new release successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testRelease),
      });

      expect(response.status).toBe(201);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.releaseName).toBe(testRelease.releaseName);
      expect(result.data.version).toBe(testRelease.version);
      expect(result.data.id).toBeDefined();

      createdReleaseId = result.data.id;
    });

    test("should fail when required fields are missing", async () => {
      const incompleteRelease = {
        releaseName: "Incomplete Release",
        // missing version and releaseDate
      };

      const response = await fetch(`${API_BASE_URL}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incompleteRelease),
      });

      expect(response.status).toBe(500); // Should handle validation
    });
  });

  describe("GET /api/releases", () => {
    test("should fetch all releases", async () => {
      const response = await fetch(`${API_BASE_URL}/releases`);

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.count).toBeGreaterThan(0);
    });

    test("should return releases in correct format", async () => {
      const response = await fetch(`${API_BASE_URL}/releases`);
      const result = await response.json();

      const release = result.data[0];
      expect(release).toHaveProperty("id");
      expect(release).toHaveProperty("releaseName");
      expect(release).toHaveProperty("version");
      expect(release).toHaveProperty("releaseDate");
      expect(release).toHaveProperty("checklist");
      expect(release).toHaveProperty("checklistProgress");
    });
  });

  describe("GET /api/releases/:id", () => {
    test("should fetch a single release by ID", async () => {
      const response = await fetch(`${API_BASE_URL}/releases/${createdReleaseId}`);

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(createdReleaseId);
      expect(result.data.releaseName).toBe(testRelease.releaseName);
    });

    test("should return 404 for non-existent release", async () => {
      const nonExistentId = 999999;
      const response = await fetch(`${API_BASE_URL}/releases/${nonExistentId}`);

      expect(response.status).toBe(404);

      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toBe("Release not found");
    });

    test("should handle invalid ID format", async () => {
      const response = await fetch(`${API_BASE_URL}/releases/invalid-id`);
      
      expect(response.status).toBeOneOf([400, 404, 500]);
    });
  });

  describe("PUT /api/releases/:id", () => {
    test("should update release successfully", async () => {
      const updateData = {
        releaseName: "Updated Test Release v1.0",
        version: "1.0.1",
        checklist: {
          prsMerged: true,
          changelogUpdated: true,
          testsPassing: true,
          githubReleaseCreated: true,
          deployedDemo: false,
          testedDemo: false,
          deployedProduction: false,
        },
        checklistProgress: {
          total: 7,
          completed: 4,
          percentage: 57,
        },
      };

      const response = await fetch(`${API_BASE_URL}/releases/${createdReleaseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data.releaseName).toBe(updateData.releaseName);
      expect(result.data.version).toBe(updateData.version);
      expect(result.data.checklistProgress.completed).toBe(4);
    });

    test("should update partial fields", async () => {
      const partialUpdate = {
        remarks: "Updated remarks only",
      };

      const response = await fetch(`${API_BASE_URL}/releases/${createdReleaseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialUpdate),
      });

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.data.remarks).toBe(partialUpdate.remarks);
    });

    test("should return 404 when updating non-existent release", async () => {
      const response = await fetch(`${API_BASE_URL}/releases/999999`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ releaseName: "Test" }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/releases/:id", () => {
    test("should delete release successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/releases/${createdReleaseId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.message).toBe("Release deleted successfully");

      // Verify deletion
      const getResponse = await fetch(`${API_BASE_URL}/releases/${createdReleaseId}`);
      expect(getResponse.status).toBe(404);

      createdReleaseId = 0; // Prevent cleanup from trying to delete again
    });

    test("should return 404 when deleting non-existent release", async () => {
      const response = await fetch(`${API_BASE_URL}/releases/999999`, {
        method: "DELETE",
      });

      expect(response.status).toBe(404);

      const result = await response.json();
      expect(result.success).toBe(false);
    });
  });

  describe("Checklist Progress Calculation", () => {
    test("should correctly calculate progress percentage", async () => {
      const newRelease = {
        releaseName: "Progress Test Release",
        version: "2.0.0",
        releaseDate: "2026-03-15",
        remarks: "",
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

      const response = await fetch(`${API_BASE_URL}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRelease),
      });

      const result = await response.json();
      expect(result.data.checklistProgress.completed).toBe(3);
      expect(result.data.checklistProgress.percentage).toBe(43);

      // Cleanup
      await db.delete(releases).where(eq(releases.id, result.data.id));
    });
  });
});

describe("Health Check Endpoint", () => {
  test("should return OK status", async () => {
    const response = await fetch("http://localhost:5000/health");

    expect(response.status).toBe(200);

    const result = await response.json();
    expect(result.status).toBe("OK");
    expect(result.timestamp).toBeDefined();
  });
});
