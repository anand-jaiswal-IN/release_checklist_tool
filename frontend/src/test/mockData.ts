import type { Release } from '../services/api';

export const mockRelease: Release = {
  id: 1,
  releaseName: 'Test Release v1.0',
  version: '1.0.0',
  releaseDate: '2026-03-01',
  remarks: 'Test release remarks',
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
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
};

export const mockReleases: Release[] = [
  mockRelease,
  {
    id: 2,
    releaseName: 'Test Release v2.0',
    version: '2.0.0',
    releaseDate: '2026-04-01',
    remarks: 'Second test release',
    checklist: {
      prsMerged: true,
      changelogUpdated: true,
      testsPassing: true,
      githubReleaseCreated: true,
      deployedDemo: true,
      testedDemo: true,
      deployedProduction: true,
    },
    checklistProgress: {
      total: 7,
      completed: 7,
      percentage: 100,
    },
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 3,
    releaseName: 'Test Release v0.5',
    version: '0.5.0',
    releaseDate: '2026-02-01',
    remarks: null,
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
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
];
