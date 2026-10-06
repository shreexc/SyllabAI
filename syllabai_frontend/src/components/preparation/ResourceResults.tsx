"use client";

import type { LearningResource } from "@/types/learning";

const typeLabel: Record<LearningResource["resource_type"], string> = {
  pdf: "PDF document",
  image: "Image",
  txt: "Text file",
  docx: "Word document",
  external: "External source",
};

function bytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResourceResults({ resources, selectedId, onSelect }: { resources: LearningResource[]; selectedId?: string; onSelect: (resource: LearningResource) => void }) {
  if (resources.length === 0) return <p className="resource-empty">No ready resources match yet. Upload a resource to create your private library.</p>;
  return (
    <section className="resource-results" aria-label="Search results">
      {resources.map((resource) => (
        <article className={`resource-result${selectedId === resource.id ? " resource-result--selected" : ""}`} key={resource.id}>
          <div className="resource-result-topline"><span className="resource-file-mark">{resource.resource_type.toUpperCase()}</span><span className="resource-result-type">{typeLabel[resource.resource_type]}{resource.page_count ? ` · ${resource.page_count} pages` : resource.file_size ? ` · ${bytes(resource.file_size)}` : ""}</span></div>
          <h3>{resource.title}</h3>
          <p className="resource-result-description">{resource.description || resource.preview || "This resource has been processed and is ready to use."}</p>
          {resource.relevant_pages.length > 0 && <p className="resource-license">Relevant pages: {resource.relevant_pages.join(", ")}</p>}
          {resource.source_type === "external" && <p className="resource-license">Source: {resource.source_provider || "External"} · {resource.license_name || "Review usage rights"}</p>}
          {resource.preview && <details className="resource-preview"><summary>Preview source text</summary><p>{resource.preview}</p></details>}
          <div className="resource-result-actions">
            <button type="button" className="resource-use-button" onClick={() => onSelect(resource)}>{selectedId === resource.id ? "Selected ✓" : "Use this resource"}</button>
            {resource.source_url && <a href={resource.source_url} target="_blank" rel="noreferrer">View source ↗</a>}
          </div>
        </article>
      ))}
    </section>
  );
}
