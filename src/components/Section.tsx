import type { Page } from "../api/api";
import "../style/Section.css";

interface SectionProps {
  page?: Page;
  id: string;
}

const Section = ({ page, id }: SectionProps) => {
  const contentHtml = page?.content?.rendered ?? "";

  if (!page || !contentHtml) {
    return null;
  }

  return (
    <section className="section" id={id}>
      <div
        className="section__content wp-blocks"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </section>
  );
};

export default Section;
