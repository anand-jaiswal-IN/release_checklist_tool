import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Releases from '../Releases';
import { mockReleases } from '../../test/mockData';
import * as apiModule from '../../services/api';

// Mock the apiService
vi.mock('../../services/api', () => ({
  apiService: {
    getAllReleases: vi.fn(),
    deleteRelease: vi.fn(),
  },
  calculateReleaseStatus: (completed: number, total: number) => {
    if (completed === 0) return 'planned';
    if (completed === total) return 'done';
    return 'ongoing';
  },
}));

// Mock window.confirm
window.confirm = vi.fn(() => true);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Releases Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockReturnValue(new Promise(() => {}));

    renderWithRouter(<Releases />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render releases table after loading', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue(mockReleases);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Release v1.0')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('ONGOING')).toBeInTheDocument();
  });

  it('should render error message on fetch failure', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockRejectedValue(new Error('Failed to fetch'));

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should display "No releases found" when empty', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue([]);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(
        screen.getByText(/No releases found. Create your first release!/i)
      ).toBeInTheDocument();
    });
  });

  it('should display correct status chips', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue(mockReleases);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(screen.getByText('ONGOING')).toBeInTheDocument();
      expect(screen.getByText('DONE')).toBeInTheDocument();
      expect(screen.getByText('PLANNED')).toBeInTheDocument();
    });
  });

  it('should display progress percentage chips', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue(mockReleases);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(screen.getByText('43%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  it('should have view and delete action buttons for each release', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue([mockReleases[0]]);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      const actionButtons = screen.getAllByRole('button');
      // Should have at least 2 buttons (view and delete)
      expect(actionButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should call deleteRelease when delete button is clicked', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue([mockReleases[0]]);
    mockApiService.deleteRelease.mockResolvedValue({ message: 'Deleted successfully' });

    renderWithRouter(<Releases />);

    await waitFor(() => {
      expect(screen.getByText('Test Release v1.0')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(
      (btn) => btn.querySelector('svg')?.getAttribute('data-testid') === 'DeleteIcon'
    );

    if (deleteButton) {
      deleteButton.click();

      await waitFor(() => {
        expect(mockApiService.deleteRelease).toHaveBeenCalledWith(1);
      });
    }
  });

  it('should format dates correctly', async () => {
    const mockApiService = vi.mocked(apiModule.apiService);
    mockApiService.getAllReleases.mockResolvedValue([mockReleases[0]]);

    renderWithRouter(<Releases />);

    await waitFor(() => {
      const dateElement = screen.getByText('3/1/2026');
      expect(dateElement).toBeInTheDocument();
    });
  });
});
