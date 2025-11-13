import { useEffect, useState } from "react";
import { fetchWorks } from "../api/api";
import type { Work } from "../api/api";
import WorkCard from "./WorkCard";
import "../style/WorksGrid.css";

const WorksGrid = () => {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    fetchWorks().then(setWorks);
  }, []);

  return (
    <div className="works-grid">
      {works.map(work => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}

export default  WorksGrid;