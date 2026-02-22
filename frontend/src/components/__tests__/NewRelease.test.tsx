import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NewRelease from '../release/NewRelease';
import { apiService } from '../../services/api';

// Mock the apiService
vi.mock('../../services/api', () => ({
  apiService: {
    createRelease: vi.fn(),
  },
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <NewRelease />
    </BrowserRouter>
  );
};

describe('NewRelease Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form with all fields', () => {
    renderComponent();

    expect(screen.getByText(/Create New Release/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Release Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Version/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Release Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Release Checklist/i)).toBeInTheDocument();
  });

  it('should render all checklist items', () => {
    renderComponent();

    expect(
      screen.getByText(/All relevant GitHub pull requests have been merged/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CHANGELOG.md files have been updated/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/All tests are passing/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Releases in Github created/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Deployed in demo/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tested thoroughly in demo/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Deployed in production/i)).toBeInTheDocument();
  });

  it('should allow user to fill in the form', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByLabelText(/Release Name/i);
    const versionInput = screen.getByLabelText(/Version/i);
    const dateInput = screen.getByLabelText(/Release Date/i);

    await user.type(nameInput, 'Test Release v1.0');
    await user.type(versionInput, '1.0.0');
    await user.type(dateInput, '2026-03-01');

    expect(nameInput).toHaveValue('Test Release v1.0');
    expect(versionInput).toHaveValue('1.0.0');
    expect(dateInput).toHaveValue('2026-03-01');
  });

  it('should allow checking checklist items', async () => {
    const user = userEvent.setup();
    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox');
    
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it('should submit the form successfully', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    
    const mockNewRelease = {
      id: 1,
      releaseName: 'Test Release v1.0',
      version: '1.0.0',
      releaseDate: '2026-03-01',
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
      createdAt: '2026-02-22T00:00:00.000Z',
      updatedAt: '2026-02-22T00:00:00.000Z',
    };

    mockApiService.createRelease.mockResolvedValue(mockNewRelease);

    renderComponent();

    // Fill in required fields
    await user.type(screen.getByLabelText(/Release Name/i), 'Test Release v1.0');
    await user.type(screen.getByLabelText(/Version/i), '1.0.0');
    await user.type(screen.getByLabelText(/Release Date/i), '2026-03-01');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Release/i });
    await user.click(submitButton);

    // Verify API call
    await waitFor(() => {
      expect(mockApiService.createRelease).toHaveBeenCalled();
    });

    // Verify navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/releases/1');
    });
  });

  it('should display error message on submission failure', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    
    mockApiService.createRelease.mockRejectedValue(new Error('Failed to create release'));

    renderComponent();

    // Fill in required fields
    await user.type(screen.getByLabelText(/Release Name/i), 'Test Release');
    await user.type(screen.getByLabelText(/Version/i), '1.0.0');
    await user.type(screen.getByLabelText(/Release Date/i), '2026-03-01');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Release/i });
    await user.click(submitButton);

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/Failed to create release/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    
    mockApiService.createRelease.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderComponent();

    // Fill in required fields
    await user.type(screen.getByLabelText(/Release Name/i), 'Test');
    await user.type(screen.getByLabelText(/Version/i), '1.0.0');
    await user.type(screen.getByLabelText(/Release Date/i), '2026-03-01');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Release/i });
    await user.click(submitButton);

    // Check for loading state
    expect(screen.getByText(/Creating.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should clear form when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByLabelText(/Release Name/i);
    await user.type(nameInput, 'Test Release');

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(nameInput).toHaveValue('');
  });

  it('should calculate progress correctly', async () => {
    const user = userEvent.setup();
    const mockApiService = vi.mocked(apiService);
    
    mockApiService.createRelease.mockResolvedValue({
      id: 1,
      releaseName: 'Test',
      version: '1.0.0',
      releaseDate: '2026-03-01',
      remarks: null,
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
      createdAt: '2026-02-22T00:00:00.000Z',
      updatedAt: '2026-02-22T00:00:00.000Z',
    });

    renderComponent();

    // Fill required fields
    await user.type(screen.getByLabelText(/Release Name/i), 'Test');
    await user.type(screen.getByLabelText(/Version/i), '1.0.0');
    await user.type(screen.getByLabelText(/Release Date/i), '2026-03-01');

    // Check 3 out of 7 checklist items
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(checkboxes[2]);

    // Submit
    const submitButton = screen.getByRole('button', { name: /Create Release/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          checklistProgress: {
            total: 7,
            completed: 3,
            percentage: 43,
          },
        })
      );
    });
  });
});
