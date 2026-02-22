import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {items.map((item, index) => {
        if (item.isActive || !item.path) {
          return (
            <Typography key={index} sx={{ color: "text.primary" }}>
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            component={RouterLink}
            to={item.path}
            underline="hover"
            key={index}
            color="primary"
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
