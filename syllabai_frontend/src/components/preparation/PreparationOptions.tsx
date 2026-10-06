"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { PreparationOptions as Options, PreparationType } from "@/types/learning";

interface Props {
  type: PreparationType;
  disabled: boolean;
  onPrepare: (options: Options) => Promise<void>;
  onOptionsChange?: (options: Options) => void;
  showSubmit?: boolean;
}

export function PreparationOptions({ type, disabled, onPrepare, onOptionsChange, showSubmit = true }: Props) {
  const [count, setCount] = useState(type === "flashcard" ? 20 : 10);
  const [duration, setDuration] = useState(90);
  const [difficulty, setDifficulty] = useState("medium");
  const [noteDifficulty, setNoteDifficulty] = useState("student");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [style, setStyle] = useState("educational");
  const [language, setLanguage] = useState("en");
  const [questionTypes, setQuestionTypes] = useState<Array<"mcq" | "true_false" | "fill_in_blank">>(["mcq", "true_false"]);
  const [topic, setTopic] = useState("");
  const [imageMode, setImageMode] = useState<Options["image_mode"]>("diagram");
  const [aspectRatio, setAspectRatio] = useState<Options["aspect_ratio"]>("16:9");
  const [labels, setLabels] = useState(true);
  const [noteStyle, setNoteStyle] = useState("bullet_points");
  const [otherRequest, setOtherRequest] = useState("");
  const [otherFormat, setOtherFormat] = useState<NonNullable<Options["other_format"]>>("study_guide");

  function buildOptions(): Options {
    const common = { language };
    let options: Options;
    switch (type) {
      case "quiz": options = { ...common, count, difficulty, question_types: questionTypes, ...(topic.trim() ? { topic: topic.trim() } : {}) }; break;
      case "short_note": options = { ...common, length, difficulty: noteDifficulty, style: noteStyle }; break;
      case "flashcard": options = { ...common, count, difficulty }; break;
      case "image": options = { image_mode: imageMode, style, labels, aspect_ratio: aspectRatio }; break;
      case "animation": options = { ...common, duration, difficulty, style, animation_type: "concept_explanation" }; break;
      case "other": options = { ...common, other_request: otherRequest.trim(), other_format: otherFormat }; break;
    }
    return options;
  }

  useEffect(() => {
    onOptionsChange?.(buildOptions());
  // The callback is a parent state setter and stable throughout this form's life.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, count, duration, difficulty, noteDifficulty, length, style, language, questionTypes, topic, imageMode, aspectRatio, labels, noteStyle, otherRequest, otherFormat]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onPrepare(buildOptions());
  }

  function toggleQuestionType(value: "mcq" | "true_false" | "fill_in_blank") {
    setQuestionTypes((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <form className="preparation-options" onSubmit={submit}>
      <div className="preparation-options-heading"><span className="eyebrow">MAKE IT YOURS</span><h3>Preparation options</h3></div>
      <div className="preparation-option-grid">
        {(type === "quiz" || type === "flashcard") && <label className="preparation-field"><span>{type === "quiz" ? "Number of questions" : "Number of cards"}</span><input type="number" min={1} max={type === "quiz" ? 50 : 100} value={count} onChange={(event) => setCount(Number(event.target.value))} required /></label>}
        {type === "animation" && <label className="preparation-field"><span>Duration (seconds)</span><input type="number" min={10} max={300} step={10} value={duration} onChange={(event) => setDuration(Number(event.target.value))} required /></label>}
        {(type === "quiz" || type === "flashcard" || type === "animation") && <label className="preparation-field"><span>Difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>{(type === "animation" ? ["beginner", "intermediate", "advanced"] : ["easy", "medium", "hard"]).map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>}
        {type === "short_note" && <label className="preparation-field"><span>Length</span><select value={length} onChange={(event) => setLength(event.target.value as typeof length)}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Detailed</option></select></label>}
        {type === "short_note" && <label className="preparation-field"><span>Reading level</span><select value={noteDifficulty} onChange={(event) => setNoteDifficulty(event.target.value)}><option value="student">Student-friendly</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>}
        {type === "short_note" && <label className="preparation-field"><span>Style</span><select value={noteStyle} onChange={(event) => setNoteStyle(event.target.value)}><option value="bullet_points">Bullet points</option><option value="paragraph">Paragraph</option></select></label>}
        {type === "image" && <label className="preparation-field"><span>Image workflow</span><select value={imageMode} onChange={(event) => setImageMode(event.target.value as Options["image_mode"])}><option value="diagram">Educational diagram</option><option value="infographic">Infographic</option><option value="illustration">Illustration</option><option value="flowchart">Flowchart</option><option value="source_image">Use uploaded image</option><option value="extracted_image">Extract image from PDF</option></select></label>}
        {type === "image" && <label className="preparation-field"><span>Aspect ratio</span><select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as Options["aspect_ratio"])}><option value="16:9">16:9 landscape</option><option value="4:3">4:3</option><option value="1:1">Square</option><option value="9:16">9:16 portrait</option></select></label>}
        {type === "image" && <label className="preparation-check"><input type="checkbox" checked={labels} onChange={(event) => setLabels(event.target.checked)} /> Include labels</label>}
        {type === "image" && <label className="preparation-field"><span>Visual style</span><input value={style} onChange={(event) => setStyle(event.target.value)} maxLength={60} /></label>}
        {type === "animation" && <label className="preparation-field"><span>Animation style</span><input value={style} onChange={(event) => setStyle(event.target.value)} maxLength={60} /></label>}
        {type === "other" && <label className="preparation-field preparation-field--wide"><span>What else would you like to prepare?</span><textarea value={otherRequest} onChange={(event) => setOtherRequest(event.target.value)} minLength={5} maxLength={240} required placeholder="For example: create a revision guide focused on the key processes" /><small>{otherRequest.trim().length}/240 characters</small></label>}
        {type === "other" && <label className="preparation-field"><span>Starting format</span><select value={otherFormat} onChange={(event) => setOtherFormat(event.target.value as NonNullable<Options["other_format"]>)}><option value="study_guide">Study guide</option><option value="glossary">Glossary</option><option value="outline">Topic outline</option><option value="practice_prompts">Practice prompts</option></select></label>}
        {type === "quiz" && <label className="preparation-field"><span>Topic / section (optional)</span><input value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={160} placeholder="e.g. cardiac cycle" /></label>}
        <label className="preparation-field"><span>Language</span><input value={language} onChange={(event) => setLanguage(event.target.value)} maxLength={12} placeholder="en" /></label>
      </div>
      {type === "quiz" && <fieldset className="question-type-fieldset"><legend>Question types</legend>{(["mcq", "true_false", "fill_in_blank"] as const).map((item) => <label key={item}><input type="checkbox" checked={questionTypes.includes(item)} onChange={() => toggleQuestionType(item)} />{item === "mcq" ? "Multiple choice" : item === "true_false" ? "True / false" : "Fill in the blank"}</label>)}</fieldset>}
      {showSubmit && <button className="preparation-action preparation-submit" type="submit" disabled={disabled}>{disabled ? "Starting…" : "Prepare my material"}<span>✦</span></button>}
      <p className="preparation-cost-note">Generation is source-grounded and bounded. No external AI provider is configured in this environment.</p>
    </form>
  );
}
