const questions = [
  {
    question: "How does SyllabAI ensure accuracy?",
    answer:
      "SyllabAI creates study tools from text extracted from your source materials, helping keep the results tied to what you provided rather than unsupported claims.",
  },
  {
    question: "What file formats can I upload?",
    answer:
      "You can upload PDFs, text files (.txt), Word documents (.docx), and common image files (.png, .jpeg).",
  },
  {
    question: "Is there a difference between Teacher and Student accounts?",
    answer:
      "Yes. Teacher and Student accounts have separate role-based spaces and workflows for preparing or studying learning materials.",
  },
  {
    question: "Are my study materials private?",
    answer:
      "Uploaded files and generated study materials are scoped to your account and protected by role-based access controls.",
  },
];

export function FaqSection() {
  return (
    <section className="landing-section landing-faq" aria-labelledby="faq-title">
      <div className="section-container">
        <h2 className="landing-section-title" id="faq-title">Frequently asked questions</h2>
        <div className="faq-grid">
          {questions.map((item) => (
            <details className="faq-item" key={item.question} open>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
