import type { Page } from "../api/api";
import '../style/section.css'

const imgUrl = "https://marialetizia.netsons.org"

interface SectionProps {
  page: Page;
  id: string;
}

const Section = ({ page, id}: SectionProps) => {

  let grid;
  try {
    grid = JSON.parse(page.grid);
  } catch (e) {
    console.error("Grid JSON error:", e);
    return null;
  }

  return (
    <section className="section" id={id}>
      {grid.cont.map((el: any, idx: number) => {
        if (el.type === "img") {
          return (
            <img
              key={idx}
              src={imgUrl + el.cont}
              alt={el.alt || ""}
              style={{ width: el.w, height: el.h }}
            />
          );
        }

        if (el.type === "text") {
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: el.cont }} />
          );
        }

        return null;
      })}
    </section>
  );
};

export default Section;
