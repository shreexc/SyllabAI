"use client";

import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { getApiErrorDescription } from "@/lib/api";
import {
  Classroom,
  createClassroom,
  joinClassroom,
  listClassrooms,
} from "@/lib/classroom-api";

type ClassroomRole = "teacher" | "student";

const CODE_LENGTH = 6;

function messageFrom(error: unknown): string {
  return getApiErrorDescription(error)
    ?? (error instanceof Error ? error.message : "Something went wrong. Please try again.");
}

function ClassCodeInputs({
  code,
  onChange,
}: {
  code: string[];
  onChange: (nextCode: string[]) => void;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const setCodeAt = (index: number, value: string) => {
    const characters = value.toUpperCase().replace(/[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g, "");
    if (!characters) {
      const next = [...code];
      next[index] = "";
      onChange(next);
      return;
    }

    const next = [...code];
    characters.slice(0, CODE_LENGTH - index).split("").forEach((character, offset) => {
      next[index + offset] = character;
    });
    onChange(next);
    inputs.current[Math.min(index + characters.length, CODE_LENGTH - 1)]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const characters = event.clipboardData.getData("text").toUpperCase()
      .replace(/[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g, "")
      .slice(0, CODE_LENGTH);
    const next = Array.from({ length: CODE_LENGTH }, (_, index) => characters[index] ?? "");
    onChange(next);
    inputs.current[Math.min(characters.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="classroom-code-inputs" role="group" aria-label="Class code">
      {code.map((character, index) => (
        <input
          key={index}
          id={index === 0 ? "class-code-0" : undefined}
          ref={(element) => { inputs.current[index] = element; }}
          aria-label={`Class code character ${index + 1} of ${CODE_LENGTH}`}
          autoComplete="off"
          inputMode="text"
          maxLength={CODE_LENGTH}
          onChange={(event) => setCodeAt(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          value={character}
        />
      ))}
    </div>
  );
}

function ClassroomCards({
  classrooms,
  role,
  onCopy,
}: {
  classrooms: Classroom[];
  role: ClassroomRole;
  onCopy: (classCode: string) => void;
}) {
  if (classrooms.length === 0) {
    return <p className="classroom-code-empty">Your classes will appear here.</p>;
  }

  return (
    <section className="classroom-code-list" aria-label={role === "teacher" ? "Created classes" : "Joined classes"}>
      <h2>Your classes</h2>
      {classrooms.map((classroom) => (
        <article className="classroom-code-list-item" key={classroom.id}>
          <div>
            <h3>{classroom.name}</h3>
            <p>{classroom.subject}{role === "student" && classroom.teacher_name ? ` · ${classroom.teacher_name}` : ""}</p>
            {role === "teacher" && <span>{classroom.student_count} {classroom.student_count === 1 ? "student" : "students"}</span>}
          </div>
          {role === "teacher" && (
            <div className="classroom-code-share">
              <span>Class code</span>
              <strong>{classroom.class_code ?? "Unavailable"}</strong>
              {classroom.class_code && (
                <button onClick={() => onCopy(classroom.class_code ?? "")} type="button">Copy code</button>
              )}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

export function ClassroomCodePage({ role }: { role: ClassroomRole }) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    listClassrooms(role)
      .then((results) => {
        if (active) setClassrooms(results);
      })
      .catch((caught: unknown) => {
        if (active) setError(messageFrom(caught));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [role]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      if (role === "student") {
        const classroom = await joinClassroom(code.join(""));
        setClassrooms((current) => current.some((item) => item.id === classroom.id)
          ? current
          : [classroom, ...current]);
        setCode(Array(CODE_LENGTH).fill(""));
        setNotice(`You joined ${classroom.name}.`);
      } else {
        const classroom = await createClassroom(name.trim(), subject.trim());
        setClassrooms((current) => [classroom, ...current]);
        setName("");
        setSubject("");
        setNotice(`Class created. Share code ${classroom.class_code} with your students.`);
      }
    } catch (caught) {
      setError(messageFrom(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = async (classCode: string) => {
    try {
      await navigator.clipboard.writeText(classCode);
      setNotice("Class code copied to clipboard.");
      setError("");
    } catch {
      setError("Could not copy the class code. Please select and copy it manually.");
    }
  };

  const isStudent = role === "student";

  return (
    <main className="classroom-code-page">
      <div className="classroom-code-content">
        <p className="classroom-code-eyebrow">My Classroom</p>
        <h1>{isStudent ? "Join a class" : "Create a class"}</h1>
        <p className="classroom-code-intro">
          {isStudent
            ? "To join, get the code from your teacher"
            : "Create a class and share its code with your students"}
        </p>

        <form className="classroom-code-card" onSubmit={handleSubmit}>
          {isStudent ? (
            <>
              <label className="classroom-code-label" htmlFor="class-code-0">Class code</label>
              <ClassCodeInputs code={code} onChange={setCode} />
              <button className="classroom-code-submit" disabled={submitting || code.some((character) => !character)} type="submit">
                {submitting ? "Joining..." : "Join"}
              </button>
            </>
          ) : (
            <>
              <label className="classroom-code-label" htmlFor="class-name">Class name</label>
              <input
                autoComplete="off"
                className="classroom-create-input"
                id="class-name"
                maxLength={100}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Grade 8 Biology"
                required
                value={name}
              />
              <label className="classroom-code-label" htmlFor="class-subject">Subject</label>
              <input
                autoComplete="off"
                className="classroom-create-input"
                id="class-subject"
                maxLength={100}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Biology"
                required
                value={subject}
              />
              <button className="classroom-code-submit" disabled={submitting || !name.trim() || !subject.trim()} type="submit">
                {submitting ? "Creating..." : "Create class"}
              </button>
            </>
          )}
          {error && <p className="classroom-code-feedback classroom-code-feedback--error" role="alert">{error}</p>}
          {notice && <p className="classroom-code-feedback" role="status">{notice}</p>}
        </form>

        {loading ? (
          <p className="classroom-code-loading" role="status">Loading your classes...</p>
        ) : (
          <ClassroomCards classrooms={classrooms} onCopy={handleCopyCode} role={role} />
        )}
      </div>
    </main>
  );
}
