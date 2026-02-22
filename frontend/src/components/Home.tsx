import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";

import Releases from "./Releases";
import BreadcrumbNav from "./common/BreadcrumbNav";

import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  return (
    <section id="main" className="mx-40">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold">ReleaseCheck</h1>
        <p>Your all-in-one release checklist tool</p>
      </div>

      <div className="flex justify-between border-2 items-center p-4 mb-4">
        <div>
          <BreadcrumbNav
            items={[
              { label: "All Releases", isActive: true },
            ]}
          />
        </div>
        <div>
          <RouterLink to="/releases/new">
            <Button variant="contained">New Release {<Add />}</Button>
          </RouterLink>
        </div>
      </div>

      <div>
        <Releases />
      </div>
    </section>
  );
}
