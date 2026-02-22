import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import Delete from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";

function createData(
  release: string,
  date: Date,
  status: string,
  view_link: string,
  delete_link: string,
) {
  return { release, date, status, view_link, delete_link };
}

const rows = [
  createData("Version 1.0.1", new Date(Date.now()), "Done", "ahd", "adg"),
];

export default function ReleasesTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Release</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}></TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.release}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.release}
              </TableCell>
              <TableCell align="right">{row.date.toDateString()}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">
                View{" "}
                <Link to={row.view_link}>
                  <RemoveRedEye sx={{ fontSize: 18 }} />
                </Link>
              </TableCell>
              <TableCell align="right">
                Delete{" "}
                <Link to={row.delete_link}>
                  <Delete sx={{ fontSize: 18 }} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
