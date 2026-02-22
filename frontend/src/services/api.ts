const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Release {
  id: number;
  releaseName: string;
  version: string;
  releaseDate: string;
  remarks: string | null;
  checklist: {
    prsMerged: boolean;
    changelogUpdated: boolean;
    testsPassing: boolean;
    githubReleaseCreated: boolean;
    deployedDemo: boolean;
    testedDemo: boolean;
    deployedProduction: boolean;
  };
  checklistProgress: {
    total: number;
    completed: number;
    percentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewReleaseData {
  releaseName: string;
  version: string;
  releaseDate: string;
  remarks?: string;
  checklist: {
    prsMerged: boolean;
    changelogUpdated: boolean;
    testsPassing: boolean;
    githubReleaseCreated: boolean;
    deployedDemo: boolean;
    testedDemo: boolean;
    deployedProduction: boolean;
  };
  checklistProgress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

class APIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // Extract data from the wrapper if it exists
    return result.data !== undefined ? result.data : result;
  }

  // Get all releases
  async getAllReleases(): Promise<Release[]> {
    const response = await fetch(`${this.baseUrl}/releases`);
    return this.handleResponse<Release[]>(response);
  }

  // Get release by ID
  async getReleaseById(id: number): Promise<Release> {
    const response = await fetch(`${this.baseUrl}/releases/${id}`);
    return this.handleResponse<Release>(response);
  }

  // Create new release
  async createRelease(data: NewReleaseData): Promise<Release> {
    const response = await fetch(`${this.baseUrl}/releases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Release>(response);
  }

  // Update release
  async updateRelease(id: number, data: Partial<NewReleaseData>): Promise<Release> {
    const response = await fetch(`${this.baseUrl}/releases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Release>(response);
  }

  // Delete release
  async deleteRelease(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/releases/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    return result;
  }
}

export const apiService = new APIService();
