import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "../common/BreadcrumbNav";

export default function ViewRelease() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Mock data - replace with actual data from API/props
  const [releaseData, setReleaseData] = useState({
    releaseName: "Version 1.0.1",
    version: "1.0.1",
    releaseDate: "2026-02-22",
    remarks: "Initial release with core features",
    checklist: {
      prsMerged: true,
      changelogUpdated: true,
      testsPassing: true,
      githubReleaseCreated: false,
      deployedDemo: false,
      testedDemo: false,
      deployedProduction: false,
    },
  });

  const [editedData, setEditedData] = useState(releaseData);

  const checklistItems = [
    { key: "prsMerged", label: "All relevant GitHub pull requests have been merged" },
    { key: "changelogUpdated", label: "CHANGELOG.md files have been updated" },
    { key: "testsPassing", label: "All tests are passing" },
    { key: "githubReleaseCreated", label: "Releases in Github created" },
    { key: "deployedDemo", label: "Deployed in demo" },
    { key: "testedDemo", label: "Tested thoroughly in demo" },
    { key: "deployedProduction", label: "Deployed in production" },
  ];

  const calculateProgress = (checklist: Record<string, boolean>) => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const progress = calculateProgress(releaseData.checklist);

  const handleCheckboxChange = (key: string) => {
    setEditedData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key as keyof typeof prev.checklist],
      },
    }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setReleaseData(editedData);
    setIsEditing(false);
    console.log("Updated release data:", editedData);
    // Add API call here to save changes
  };

  const handleCancel = () => {
    setEditedData(releaseData);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting release:", releaseData);
    // Add API call here to delete the release
    setOpenDeleteDialog(false);
    navigate("/");
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return "success";
    if (percentage >= 50) return "warning";
    return "error";
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <BreadcrumbNav
          items={[
            { label: "All Releases", path: "/" },
            { label: releaseData.releaseName, isActive: true },
          ]}
        />
      </Box>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="outlined"
        >
          Back to Releases
        </Button>
        {!isEditing ? (
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={handleEdit}
            >
              Edit Release
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              startIcon={<CancelIcon />}
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Release Information */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Release Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Release Name"
                    name="releaseName"
                    value={editedData.releaseName}
                    onChange={handleFieldChange}
                  />
                  <TextField
                    fullWidth
                    label="Version"
                    name="version"
                    value={editedData.version}
                    onChange={handleFieldChange}
                  />
                  <TextField
                    fullWidth
                    label="Release Date"
                    name="releaseDate"
                    type="date"
                    value={editedData.releaseDate}
                    onChange={handleFieldChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    value={editedData.remarks}
                    onChange={handleFieldChange}
                    multiline
                    rows={4}
                  />
                </>
              ) : (
                <>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Release Name
                    </Typography>
                    <Typography variant="h6">{releaseData.releaseName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Version
                    </Typography>
                    <Typography variant="h6">{releaseData.version}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Release Date
                    </Typography>
                    <Typography variant="h6">
                      {new Date(releaseData.releaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Remarks
                    </Typography>
                    <Typography variant="body1">
                      {releaseData.remarks || "No remarks"}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Box>

        {/* Progress Overview */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Progress Overview
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Completion Status
                  </Typography>
                  <Chip
                    label={`${progress.percentage}%`}
                    color={getStatusColor(progress.percentage)}
                    size="small"
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress.percentage}
                  color={getStatusColor(progress.percentage)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="caption" color="text.secondary" mt={1}>
                  {progress.completed} of {progress.total} tasks completed
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Tasks Completed:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {progress.completed}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Tasks Remaining:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {progress.total - progress.completed}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total Tasks:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {progress.total}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Release Checklist */}
      <Box>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Release Checklist
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormGroup>
              {checklistItems.map((item) => (
                <FormControlLabel
                  key={item.key}
                  control={
                    <Checkbox
                      checked={
                        isEditing
                          ? editedData.checklist[item.key as keyof typeof editedData.checklist]
                          : releaseData.checklist[item.key as keyof typeof releaseData.checklist]
                      }
                      onChange={() => handleCheckboxChange(item.key)}
                      disabled={!isEditing}
                    />
                  }
                  label={item.label}
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: isEditing ? "action.hover" : "transparent",
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Release?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{releaseData.releaseName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
