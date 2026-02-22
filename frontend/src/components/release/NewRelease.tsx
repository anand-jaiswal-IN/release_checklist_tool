import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";
import BreadcrumbNav from "../common/BreadcrumbNav";

export default function NewReleaseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    releaseName: "",
    version: "",
    releaseDate: "",
    remarks: "",
  });

  const [checklist, setChecklist] = useState({
    prsMerged: false,
    changelogUpdated: false,
    testsPassing: false,
    githubReleaseCreated: false,
    deployedDemo: false,
    testedDemo: false,
    deployedProduction: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChecklist((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Calculate completion percentage
      const checklistProgress = {
        total: Object.keys(checklist).length,
        completed: Object.values(checklist).filter(Boolean).length,
        percentage: Math.round(
          (Object.values(checklist).filter(Boolean).length / 
           Object.keys(checklist).length) * 100
        ),
      };
      
      // Combine form data and checklist for database storage
      const releaseData = {
        releaseName: formData.releaseName,
        version: formData.version,
        releaseDate: formData.releaseDate,
        remarks: formData.remarks || undefined,
        checklist: checklist,
        checklistProgress: checklistProgress,
      };
      
      // Create the release
      const newRelease = await apiService.createRelease(releaseData);
      
      // Navigate to the created release detail page
      navigate(`/releases/${newRelease.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create release');
      console.error('Error creating release:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      releaseName: "",
      version: "",
      releaseDate: "",
      remarks: "",
    });
    setChecklist({
      prsMerged: false,
      changelogUpdated: false,
      testsPassing: false,
      githubReleaseCreated: false,
      deployedDemo: false,
      testedDemo: false,
      deployedProduction: false,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Back to Releases
          </Button>
          <BreadcrumbNav
            items={[
              { label: "All Releases" },
              { label: "New Release", isActive: true },
            ]}
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Create New Release
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Release Name"
              name="releaseName"
              value={formData.releaseName}
              onChange={handleChange}
              required
              placeholder="e.g., Spring 2026 Release"
            />

            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
              placeholder="e.g., 1.0.0"
            />

            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Release Checklist
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="prsMerged"
                    checked={checklist.prsMerged}
                    onChange={handleCheckboxChange}
                  />
                }
                label="All relevant GitHub pull requests have been merged"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="changelogUpdated"
                    checked={checklist.changelogUpdated}
                    onChange={handleCheckboxChange}
                  />
                }
                label="CHANGELOG.md files have been updated"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="testsPassing"
                    checked={checklist.testsPassing}
                    onChange={handleCheckboxChange}
                  />
                }
                label="All tests are passing"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="githubReleaseCreated"
                    checked={checklist.githubReleaseCreated}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Releases in Github created"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="deployedDemo"
                    checked={checklist.deployedDemo}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Deployed in demo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="testedDemo"
                    checked={checklist.testedDemo}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Tested thoroughly in demo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="deployedProduction"
                    checked={checklist.deployedProduction}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Deployed in production"
              />
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label="Additional Remarks / Tasks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Enter release description, notes, or key features..."
            />

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Release'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}