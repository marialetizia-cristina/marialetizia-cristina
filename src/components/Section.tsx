import type { Page } from "../api/api";
import '../style/Section.css';

const imgUrl = "https://marialetizia.netsons.org";

interface SectionProps {
  page: Page;
  id: string;
}

// Funzione ricorsiva per renderizzare gli elementi
const renderElement = (el: any, key: number) => {
  if (el.type === "img") {
    return (
      <img
        key={key}
        src={imgUrl + el.cont}
        alt={el.alt || ""}
        style={{ width: el.w, height: el.h }}
      />
    );
  }

  if (el.type === "text") {
    return (
      <p key={key} dangerouslySetInnerHTML={{ __html: el.cont }} />
    );
  }

  if (el.type === "elementgrid") {
    const elements = el.config?.elements ?? [];
    return (
      <div key={key} className="element-grid">
        {elements.map((child: any, idx: number) => renderElement(child, idx))}
      </div>
    );
  }

  if (el.type === "stack") {
    // Ogni stack diventa un main-block
    return (
      <div key={key} className="main-block">
        {el.cont.map((child: any, idx: number) => renderElement(child, idx))}
      </div>
    );
  }

  return null;
};

const Section = ({ page, id }: SectionProps) => {
  let grid;
  try {
    grid = JSON.parse(page.grid);
  } catch (e) {
    console.error("Grid JSON error:", e);
    return null;
  }

  return (
    <section className="section" id={id}>
      <div className="section-grid">
        {grid.cont.map((el: any, idx: number) => renderElement(el, idx))}
      </div>
    </section>
  );
};

export default Section;
