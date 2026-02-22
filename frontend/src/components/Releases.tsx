import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import Delete from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";
import { apiService, type Release, calculateReleaseStatus, type ReleaseStatus } from "../services/api";

export default function ReleasesTable() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllReleases();
      setReleases(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch releases");
      console.error("Error fetching releases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this release?")) return;

    try {
      await apiService.deleteRelease(id);
      // Refresh the list
      fetchReleases();
    } catch (err) {
      alert("Failed to delete release");
      console.error("Error deleting release:", err);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return "success";
    if (percentage >= 50) return "warning";
    return "error";
  };

  const getStatusChipColor = (status: ReleaseStatus): "default" | "warning" | "success" => {
    switch (status) {
      case 'planned':
        return 'default';
      case 'ongoing':
        return 'warning';
      case 'done':
        return 'success';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (releases.length === 0) {
    return (
      <Box p={4}>
        <Typography>No releases found. Create your first release!</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="releases table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Release</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Version
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Progress
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {releases.map((release) => {
            const status = calculateReleaseStatus(
              release.checklistProgress.completed,
              release.checklistProgress.total
            );
            return (
              <TableRow
                key={release.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {release.releaseName}
                </TableCell>
                <TableCell align="right">{release.version}</TableCell>
                <TableCell align="right">
                  {new Date(release.releaseDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={status.toUpperCase()}
                    color={getStatusChipColor(status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${release.checklistProgress.percentage}%`}
                    color={getStatusColor(release.checklistProgress.percentage)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Link to={`/releases/${release.id}`}>
                    <IconButton size="small" color="primary">
                      <RemoveRedEye />
                    </IconButton>
                  </Link>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(release.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
