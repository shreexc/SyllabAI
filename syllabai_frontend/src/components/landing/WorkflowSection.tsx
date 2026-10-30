import { LandingIcon, type LandingIconName } from "./LandingIcon";

const steps: { number: string; title: string; description: string; icon: LandingIconName }[] = [
  {
    number: "01",
    title: "Search or Upload",
    description: "Add your notes or search your private library of learning materials.",
    icon: "upload",
  },
  {
    number: "02",
    title: "Choose What to Prepare",
    description: "Pick the study format that works best for the topic you are learning.",
    icon: "sparkles",
  },
  {
    number: "03",
    title: "Let SyllabAI Process",
    description: "SyllabAI extracts and organizes key information from your source.",
    icon: "settings",
  },
  {
    number: "04",
    title: "Study the Result",
    description: "Review your source-based study tools and learn at your own pace.",
    icon: "check",
  },
];

export function WorkflowSection() {
  return (
    <section className="landing-section landing-workflow" aria-labelledby="workflow-title">
      <div className="section-container">
        <h2 className="landing-section-title" id="workflow-title">SyllabAI workflow</h2>
        <div className="how-it-works-grid">
          {steps.map((step) => (
            <article className="how-step-card" key={step.number}>
              <div className="how-step-header">
                <span className="how-step-number">{step.number}</span>
                <LandingIcon className="how-step-icon" name={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
