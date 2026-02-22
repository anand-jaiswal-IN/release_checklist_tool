export interface Release {
  id: number;
  release_name: string;
  version: string;
  release_date: string;
  remarks: string | null;
  checklist: Checklist;
  checklist_progress: ChecklistProgress;
  created_at: Date;
  updated_at: Date;
}

export interface Checklist {
  prsMerged: boolean;
  changelogUpdated: boolean;
  testsPassing: boolean;
  githubReleaseCreated: boolean;
  deployedDemo: boolean;
  testedDemo: boolean;
  deployedProduction: boolean;
}

export interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface CreateReleaseDto {
  releaseName: string;
  version: string;
  releaseDate: string;
  remarks?: string;
  checklist: Checklist;
  checklistProgress: ChecklistProgress;
}

export interface UpdateReleaseDto {
  releaseName?: string;
  version?: string;
  releaseDate?: string;
  remarks?: string;
  checklist?: Checklist;
  checklistProgress?: ChecklistProgress;
}
