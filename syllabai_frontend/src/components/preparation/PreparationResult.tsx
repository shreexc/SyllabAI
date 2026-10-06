"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { API_URL } from "@/lib/constants";
import type { PreparationRequest, UserRole } from "@/types/learning";

type JsonRecord = Record<string, unknown>;
function text(value: unknown, fallback = ""): string { return typeof value === "string" || typeof value === "number" ? String(value) : fallback; }
function list(value: unknown): JsonRecord[] { return Array.isArray(value) ? value.filter((entry): entry is JsonRecord => typeof entry === "object" && entry !== null) : []; }

function getDedicatedHref(type: string, role: string, id: string): string | null {
  if (type === "quiz") return `/${role}/quizzes/${id}`;
  if (type === "short_note") return `/${role}/notes/${id}`;
  if (type === "flashcard") return `/${role}/flashcards/${id}`;
  if (type === "image") return `/${role}/images/${id}`;
  if (type === "animation") return `/${role}/animations/${id}`;
  return null;
}

function QuizResult({ result }: { result: JsonRecord }) {
  const questions = list(result.questions);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const score = useMemo(() => questions.reduce((sum, item, index) => sum + ((answers[index] ?? "").toLowerCase() === text(item.answer).toLowerCase() ? 1 : 0), 0), [answers, questions]);
  return (
    <section className="result-content">
      <div className="result-summary-row"><span>{questions.length} questions</span><span>{text(result.difficulty, "Source-based")}</span></div>
      {questions.map((question, index) => {
        const choices = Array.isArray(question.choices) ? question.choices.filter((choice): choice is string => typeof choice === "string") : question.type === "true_false" ? ["true", "false"] : [];
        return <fieldset className="result-question" key={text(question.id, String(index))}><legend>{index + 1}. {text(question.question)}</legend>{choices.length > 0 ? <div className="result-choices">{choices.map((choice) => <label key={choice}><input type="radio" name={`question-${index}`} value={choice} checked={answers[index] === choice} onChange={() => setAnswers((current) => ({ ...current, [index]: choice }))} />{choice}</label>)}</div> : <input className="result-answer-input" aria-label={`Answer ${index + 1}`} value={answers[index] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} placeholder="Your answer" />}{showAnswers && <p className="result-explanation"><strong>Answer:</strong> {text(question.answer)}. {text(question.explanation)}</p>}</fieldset>;
      })}
      {questions.length > 0 && <div className="result-actions"><button type="button" className="preparation-action preparation-action--compact" onClick={() => setShowAnswers((visible) => !visible)}>{showAnswers ? "Hide answers" : "Check answers"}</button>{showAnswers && <span className="result-score">Score: {score} / {questions.length}</span>}</div>}
      {questions.length === 0 && <p>There wasn’t enough source content to create quiz questions.</p>}
    </section>
  );
}

function NotesResult({ result }: { result: JsonRecord }) {
  const points = Array.isArray(result.key_points) ? result.key_points.filter((point): point is string => typeof point === "string") : [];
  const terms = list(result.important_terms);
  const paragraph = text(result.paragraph);
  return <section className="result-content"><p className="result-summary">{text(result.summary, "No summary was produced from this resource.")}</p>{paragraph ? <p className="result-notes-paragraph">{paragraph}</p> : <><h3>Key points</h3><ul className="result-key-points">{points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul></>}{terms.length > 0 && <><h3>Important terms</h3><dl className="result-terms">{terms.map((item, index) => <div key={`${index}-${text(item.term)}`}><dt>{text(item.term)}</dt><dd>{text(item.meaning)}</dd></div>)}</dl></>}</section>;
}

function FlashcardsResult({ result }: { result: JsonRecord }) {
  const cards = list(result.cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = cards[index];
  if (!card) return <p>No flashcards could be extracted from this source.</p>;
  return <section className="result-content"><p className="flashcard-counter">Card {index + 1} of {cards.length} <span>· Select the card to reveal its answer</span></p><button type="button" className={`flashcard-face${revealed ? " flashcard-face--back" : ""}`} onClick={() => setRevealed((value) => !value)}><span>{revealed ? "ANSWER" : "PROMPT"}</span><strong>{text(revealed ? card.back : card.front)}</strong><small>{revealed ? "Click to return to prompt" : "Click to reveal"}</small></button><div className="flashcard-controls"><button type="button" disabled={index === 0} onClick={() => { setIndex((value) => value - 1); setRevealed(false); }}>← Previous</button><button type="button" disabled={index >= cards.length - 1} onClick={() => { setIndex((value) => value + 1); setRevealed(false); }}>Next →</button></div></section>;
}

function ImageResult({ result }: { result: JsonRecord }) {
  const mime = text(result.mime_type, "image/svg+xml");
  const source = typeof result.image_url === "string" ? (result.image_url.startsWith("http") ? result.image_url : `${API_URL}${result.image_url}`) : typeof result.svg === "string" ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}` : typeof result.image_data === "string" ? `data:${mime};base64,${result.image_data}` : "";
  if (!source) return <p>There is no image preview available for this workflow.</p>;
  return <section className="result-content"><div className="result-image-frame"><Image src={source} alt={text(result.alt, text(result.title, "Prepared learning image"))} width={960} height={540} unoptimized /></div><p className="result-grounding">{text(result.grounding)}</p><a className="result-download" href={source} download={`${text(result.title, "learning-visual").replace(/[^a-z0-9-_]+/gi, "-")}.${mime === "image/svg+xml" ? "svg" : "png"}`}>Download image ↓</a></section>;
}

function AnimationResult({ result }: { result: JsonRecord }) {
  const scenes = list(result.scenes);
  const animationUrl = typeof result.image_url === "string" ? (result.image_url.startsWith("http") ? result.image_url : `${API_URL}${result.image_url}`) : "";
  return <section className="result-content"><div className="storyboard-preview">{animationUrl ? <Image src={animationUrl} alt={`Animated storyboard for ${text(result.title)}`} width={960} height={540} unoptimized /> : <span className="storyboard-play">▷</span>}<p>Animated storyboard · {text(result.duration)} seconds</p></div><p className="result-grounding">{text(result.grounding)}</p>{animationUrl && <a className="result-download" href={animationUrl} download={`${text(result.title, "storyboard").replace(/[^a-z0-9-_]+/gi, "-")}.svg`}>Download storyboard ↓</a>}<ol className="storyboard-scenes">{scenes.map((scene, index) => <li key={index}><span>Scene {index + 1} · {text(scene.duration)}s</span><p>{text(scene.narration)}</p></li>)}</ol></section>;
}

function OtherResult({ result }: { result: JsonRecord }) {
  const sections = list(result.sections);
  return <section className="result-content"><div className="result-summary-row"><span>{text(result.format, "custom material").replaceAll("_", " ")}</span><span>Based on your source</span></div><p className="result-summary">Your request: {text(result.requested_material)}</p>{sections.map((section, index) => <article className="other-result-section" key={`${index}-${text(section.heading)}`}><h3>{text(section.heading, `Section ${index + 1}`)}</h3><p>{text(section.content)}</p></article>)}</section>;
}

export function PreparationResult({ preparation, role }: { preparation: PreparationRequest; role?: UserRole }) {
  const result: JsonRecord = preparation.result;
  const dedicatedHref = role ? getDedicatedHref(preparation.preparation_type, role, preparation.id) : null;
  return (
    <section className="preparation-result">
      <div className="result-heading"><div><span className="eyebrow">YOUR PREPARED MATERIAL</span><h2>{text(result.title, preparation.resource.title)}</h2></div><span className="result-type-pill">{preparation.preparation_type.replace("_", " ")}</span></div>
      {preparation.preparation_type === "quiz" && <QuizResult result={result} />}
      {preparation.preparation_type === "short_note" && <NotesResult result={result} />}
      {preparation.preparation_type === "flashcard" && <FlashcardsResult result={result} />}
      {preparation.preparation_type === "image" && <ImageResult result={result} />}
      {preparation.preparation_type === "animation" && <AnimationResult result={result} />}
      {preparation.preparation_type === "other" && <OtherResult result={result} />}
      <p className="result-grounding">{text(result.grounding)}</p>
      {dedicatedHref && (
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #edf1ea", display: "flex", justifyContent: "flex-end" }}>
          <Link href={dedicatedHref} style={{ fontSize: "13px", fontWeight: 600, color: "#32735f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            Open Dedicated Learning Experience ↗
          </Link>
        </div>
      )}
    </section>
  );
}
