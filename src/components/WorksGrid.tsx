import { useEffect, useState } from "react";
import { fetchWorks, type Work } from "../api/api";
import WorkCard from "./WorkCard";
import "../style/WorksGrid.css";

interface WorksGridProps {
  category?: "ALL" | "GRAPHIC DESIGN" | "ILLUSTRATIONS" | "FEATURED";
  limits?: number;
  returnPath?: string;
}

const WorksGrid = ({ category = "ALL", limits, returnPath = "/category/all" }: WorksGridProps) => {
  //const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);

  useEffect(() => {
    fetchWorks().then(data => {
      //setWorks(data);

      if (category === "ALL") {
        setFilteredWorks(data);
      } else {
        // Filtra in base alla categoria
        setFilteredWorks(
          data.filter(work =>
            work.categories?.includes(getCategoryId(category))
          )
        );
      }
    });
  }, [category]);

  // Funzione per mappare i nomi categoria agli ID di WP
  const getCategoryId = (cat: string): number => {
    switch (cat) {
      case "GRAPHIC DESIGN":
        return 13; // sostituire con l'ID reale di GRAPHIC DESIGN
      case "ILLUSTRATIONS":
        return 4; // sostituire con l'ID reale di ILLUSTRATIONS
      case "FEATURED":
        return 14; // sostituire con l'ID reale di FEATURED      
      default:
        return 0;
    }
  };

  return (
    <div className="works-grid">
      {filteredWorks.length > 0 ? (
        (limits ? filteredWorks.slice(0, limits) : filteredWorks).map(work => (
          <WorkCard key={work.id} work={work} returnPath={returnPath} />
        ))
      ) : (
        <p>No works available.</p>
      )}
    </div>
  );

};

export default WorksGrid;
