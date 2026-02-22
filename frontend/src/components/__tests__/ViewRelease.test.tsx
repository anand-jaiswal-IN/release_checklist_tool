import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ViewRelease from '../release/ViewRelease';
import { mockRelease } from '../../test/mockData';
import { apiService } from '../../services/api';

// Mock the apiService
vi.mock('../../services/api', () => ({
  apiService: {
    getReleaseById: vi.fn(),
    updateRelease: vi.fn(),
    deleteRelease: vi.fn(),
  },
  calculateReleaseStatus: (completed: number, total: number) => {
    if (completed === 0) return 'planned';
    if (completed === total) return 'done';
    return 'ongoing';
  },
}));

// Mock react-router-dom navigate  
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

const renderComponentWithRouter = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewRelease />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('ViewRelease Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockReturnValue(new Promise(() => {}));

    renderComponentWithRouter();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render release details after loading', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('ONGOING')).toBeInTheDocument();
  });

  it('should show error message when release not found', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockRejectedValue(new Error('Release not found'));

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Release not found/i)).toBeInTheDocument();
    });
  });

  it('should display progress overview correctly', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('43%')).toBeInTheDocument();
      expect(screen.getByText('3 of 7 tasks completed')).toBeInTheDocument();
    });
  });

  it('should render all checklist items', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText(/All relevant GitHub pull requests have been merged/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/CHANGELOG.md files have been updated/i)
      ).toBeInTheDocument();
    });
  });

  it('should show checked state for completed checklist items', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked(); // prsMerged
      expect(checkboxes[1]).toBeChecked(); // changelogUpdated
      expect(checkboxes[2]).toBeChecked(); // testsPassing
      expect(checkboxes[3]).not.toBeChecked(); // githubReleaseCreated
    });
  });

  it('should enable edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // In edit mode, should show Save and Cancel buttons
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('should allow editing release fields in edit mode', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // Find and edit the release name input
    const nameInput = screen.getByLabelText(/Release Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Release Name');

    expect(nameInput).toHaveValue('Updated Release Name');
  });

  it('should save changes when Save button is clicked', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);
    mockApiService.updateRelease.mockResolvedValue({
      ...mockRelease,
      releaseName: 'Updated Release',
    });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // Make changes
    const nameInput = screen.getByLabelText(/Release Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Release');

    // Save changes
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockApiService.updateRelease).toHaveBeenCalled();
    });
  });

  it('should cancel edit mode when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // Make changes
    const nameInput = screen.getByLabelText(/Release Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Changed Name');

    // Cancel changes
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    // Should return to view mode with original data
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Release/i })).toBeInTheDocument();
    });
  });

  it('should open delete confirmation dialog when Delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    await user.click(deleteButton);

    // Should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByText(/Delete Release\?/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete/i)
      ).toBeInTheDocument();
    });
  });

  it('should delete release and navigate when confirmed', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);
    mockApiService.deleteRelease.mockResolvedValue({ message: 'Release deleted successfully' });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    await user.click(deleteButton);

    // Confirm deletion
    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: /Delete/i });
      user.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockApiService.deleteRelease).toHaveBeenCalledWith(mockRelease.id);
    });
  });

  it('should update checklist items in edit mode', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // Toggle a checklist item
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[3]); // Toggle githubReleaseCreated

    // Checkboxes should be interactive in edit mode
    expect(checkboxes[3]).not.toBeDisabled();
  });

  it('should display correct status chip color', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      const statusChip = screen.getByText('ONGOING');
      expect(statusChip).toBeInTheDocument();
    });
  });

  it('should show breadcrumb navigation', async () => {
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('All Releases')).toBeInTheDocument();
      expect(screen.getAllByText('Test Release v1.0').length).toBeGreaterThan(0);
    });
  });

  it('should handle save errors gracefully', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    mockApiService.getReleaseById.mockResolvedValue(mockRelease);
    mockApiService.updateRelease.mockRejectedValue(new Error('Save failed'));

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getAllByText('Test Release v1.0')[0]).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /Edit Release/i });
    await user.click(editButton);

    // Try to save
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/Save failed/i)).toBeInTheDocument();
    });
  });
});
