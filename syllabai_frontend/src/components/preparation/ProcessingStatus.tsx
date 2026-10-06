import type { PreparationRequest } from "@/types/learning";

const normalSteps = ["Reading source", "Finding relevant content", "Generating material", "Validating result"];
const animationSteps = ["Reading content", "Creating storyboard", "Checking scenes", "Preparing preview"];

export function ProcessingStatus({ preparation, onCancel }: { preparation: PreparationRequest; onCancel: () => void }) {
  const steps = preparation.preparation_type === "animation" ? animationSteps : normalSteps;
  const done = preparation.status === "completed";
  const failed = preparation.status === "failed";
  const cancelled = preparation.status === "cancelled";
  const current = preparation.progress.step;
  return (
    <section className={`processing-card${failed ? " processing-card--failed" : ""}`} aria-live="polite">
      <span className="eyebrow">{done ? "READY FOR YOU" : failed ? "NEEDS ANOTHER LOOK" : cancelled ? "STOPPED" : "WORK IN PROGRESS"}</span>
      <h2>{done ? "Your material is ready." : failed ? "We couldn’t finish this one." : cancelled ? "Preparation cancelled." : "Preparing your material…"}</h2>
      <p>{done ? "Your source-grounded learning material is ready below." : failed ? preparation.error_message || "Please try a different resource or options." : cancelled ? "You can choose another material whenever you’re ready." : "This work continues in the background. You can stay here while it runs."}</p>
      {!done && !failed && !cancelled && (
        <ol className="processing-steps">
          {steps.map((step, index) => {
            const completed = index < current - 1;
            const active = index === current - 1;
            return <li key={step} className={completed ? "is-complete" : active ? "is-active" : ""}><span className="processing-step-icon">{completed ? "✓" : active ? <span className="processing-spinner" /> : "○"}</span><span>{step}</span></li>;
          })}
        </ol>
      )}
      {(preparation.status === "pending" || preparation.status === "processing") && <button type="button" className="preparation-cancel" onClick={onCancel}>Cancel preparation</button>}
      {done && <div className="preparation-progress-track"><span style={{ width: "100%" }} /></div>}
    </section>
  );
}
