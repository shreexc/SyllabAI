"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { getPreparation, listPreparations, submitQuizAttempt } from "@/lib/learning-api";
import type { PreparationRequest, QuizAttemptResult, QuizContent, QuizQuestion } from "@/types/learning";

interface QuizAttemptPageProps {
  id: string;
}

export function QuizAttemptPage({ id }: QuizAttemptPageProps) {
  const [quiz, setQuiz] = useState<PreparationRequest | null>(null);
  const [related, setRelated] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);

  // Load Quiz
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPreparation("student", id);
        if (!mounted) return;
        setQuiz(data);

        if (data.resource?.id) {
          try {
            const all = await listPreparations("student");
            if (mounted) {
              setRelated(all.filter((p) => p.resource?.id === data.resource?.id && p.id !== data.id));
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load quiz.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Timer interval
  useEffect(() => {
    if (attemptResult || loading) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptResult, loading]);

  const questions: QuizQuestion[] = (quiz?.result as unknown as QuizContent)?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];

  const handleSelectAnswer = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [String(currentQuestion.id)]: value,
    }));
  };

  const handleSubmitAttempt = async () => {
    setSubmitting(true);
    try {
      const result = await submitQuizAttempt("student", id, answers);
      setAttemptResult(result);
      toast.success("Quiz completed!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit quiz attempt.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTimerSeconds(0);
    setAttemptResult(null);
  };

  if (loading) {
    return <LoadingSkeleton type="document" />;
  }

  if (error || !quiz) {
    return (
      <ErrorState
        title="Quiz not available"
        message={error || "Could not begin quiz attempt."}
        backHref="/student/quizzes"
      />
    );
  }

  if (totalQuestions === 0) {
    return (
      <ErrorState
        title="No questions in this quiz"
        message="This quiz document did not contain enough text to generate questions."
        backHref="/student/quizzes"
      />
    );
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // If quiz is finished, show result screen
  if (attemptResult) {
    const { score, total, percentage, review } = attemptResult;
    const isPassing = percentage >= 70;

    return (
      <div className="quiz-result-view">
        <PageHeader
          eyebrow="ASSESSMENT COMPLETE"
          title="Quiz Results"
          description="Review your score and read explanations derived from the source text."
          backHref="/student/quizzes"
          backLabel="All Quizzes"
        />

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Score Card */}
          <div className="quiz-result-scorecard">
            <div className="score-circle">
              {percentage}%
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "28px", fontWeight: 400, color: "#232d29", margin: "0 0 8px" }}>
              {isPassing ? "Great work!" : "Good practice effort!"}
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#616e66" }}>
              You answered <strong>{score} out of {total}</strong> questions correctly in {formatTimer(timerSeconds)}.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              <button
                type="button"
                onClick={handleRestart}
                className="quiz-btn-primary"
              >
                Try Again ↻
              </button>
              <Link
                href="/student/quizzes"
                className="quiz-btn-secondary"
                style={{ textDecoration: "none" }}
              >
                Back to Quizzes
              </Link>
            </div>
          </div>

          {/* Question Review List */}
          <section className="quiz-review-section" style={{ marginTop: "32px" }}>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", fontWeight: 400, marginBottom: "16px" }}>
              Question Review
            </h3>
            {review.map((item, index) => (
              <div
                key={item.id}
                className={`quiz-review-item ${item.is_correct ? "quiz-review-item--correct" : "quiz-review-item--incorrect"}`}
              >
                <div className={`quiz-review-status ${item.is_correct ? "quiz-review-status--correct" : "quiz-review-status--incorrect"}`}>
                  <span>{item.is_correct ? "✓ Correct" : "✗ Needs Review"}</span>
                  <span style={{ color: "#8a968f", fontWeight: 400 }}>· Question {index + 1}</span>
                </div>
                <h4 style={{ margin: "4px 0 10px", fontSize: "15px", fontWeight: 600, color: "#28332d" }}>
                  {item.question}
                </h4>
                <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "#748078" }}>Your answer: </span>
                  <strong style={{ color: item.is_correct ? "#2e8b57" : "#c93b2b" }}>
                    {item.user_answer || "(No answer given)"}
                  </strong>
                </div>
                {!item.is_correct && (
                  <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                    <span style={{ color: "#748078" }}>Correct answer: </span>
                    <strong style={{ color: "#2e8b57" }}>{item.correct_answer}</strong>
                  </div>
                )}
                {item.explanation && (
                  <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#616e66", background: "#f8faf7", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e7efe4" }}>
                    <strong>Explanation:</strong> {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </section>

          <RelatedLearning
            role="student"
            resourceId={quiz.resource?.id}
            resourceTitle={quiz.resource?.title}
            currentType="quiz"
            relatedPreparations={related.map((r) => ({
              id: r.id,
              type: r.preparation_type,
              title: String(r.result?.title || r.resource?.title || ""),
            }))}
          />
        </div>
      </div>
    );
  }

  // Active Attempt View
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedAnswer = currentQuestion ? answers[String(currentQuestion.id)] ?? "" : "";
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Question choices
  const choices = currentQuestion?.choices || (currentQuestion?.type === "true_false" ? ["true", "false"] : []);

  return (
    <div className="quiz-attempt-page">
      <PageHeader
        eyebrow="PRACTICE IN PROGRESS"
        title={String(quiz.result?.title || quiz.resource?.title || "Quiz Attempt")}
        backHref={`/student/quizzes/${quiz.id}`}
        backLabel="Exit Quiz"
      >
        <span style={{ fontSize: "13px", color: "#627067", fontFamily: "monospace", fontWeight: 600 }}>
          ⏱ {formatTimer(timerSeconds)}
        </span>
      </PageHeader>

      <div className="quiz-attempt-box">
        {/* Progress bar */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#77837b", fontWeight: 600 }}>
          <span className="quiz-question-number">Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Question Prompt */}
        <h2 className="quiz-question-text">
          {currentQuestion?.question}
        </h2>

        {/* Question Inputs */}
        <div className="quiz-options-group">
          {choices.length > 0 ? (
            choices.map((choice) => (
              <label
                key={choice}
                className={`quiz-option-label ${selectedAnswer.toLowerCase() === choice.toLowerCase() ? "quiz-option-label--selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion?.id}`}
                  value={choice}
                  checked={selectedAnswer.toLowerCase() === choice.toLowerCase()}
                  onChange={() => handleSelectAnswer(choice)}
                  style={{ accentColor: "#32735f" }}
                />
                <span>{choice}</span>
              </label>
            ))
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                placeholder="Type your answer here…"
                value={selectedAnswer}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                className="field-input"
                style={{ fontSize: "14px", height: "48px" }}
                aria-label="Your answer"
              />
              <span style={{ fontSize: "11px", color: "#8a968f" }}>
                Answer derived from source context. Spelling counts.
              </span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="quiz-nav-row">
          <button
            type="button"
            onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
            disabled={currentIndex === 0}
            className="quiz-btn-secondary"
          >
            ← Previous
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmitAttempt}
              disabled={submitting}
              className="quiz-btn-primary"
              style={{ background: "#2e6853" }}
            >
              {submitting ? "Evaluating…" : "Submit Quiz ✓"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}
              className="quiz-btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
