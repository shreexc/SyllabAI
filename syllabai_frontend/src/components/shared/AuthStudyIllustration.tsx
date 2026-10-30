export function AuthStudyIllustration() {
  return (
    <div className="auth-study-art" role="img" aria-label="A stack of study books, a note, pencil, and star">
      <span className="auth-art-orbit auth-art-orbit--one" />
      <span className="auth-art-orbit auth-art-orbit--two" />
      <span className="auth-art-star" aria-hidden="true">✦</span>
      <span className="auth-art-spark auth-art-spark--one" aria-hidden="true">✧</span>
      <span className="auth-art-spark auth-art-spark--two" aria-hidden="true">✦</span>
      <div className="auth-art-book auth-art-book--back" aria-hidden="true" />
      <div className="auth-art-book auth-art-book--middle" aria-hidden="true" />
      <div className="auth-art-book auth-art-book--front" aria-hidden="true" />
      <div className="auth-art-note" aria-hidden="true">
        <span className="auth-art-note-kicker" />
        <span className="auth-art-note-title" />
        <span className="auth-art-note-line" />
        <span className="auth-art-note-line auth-art-note-line--short" />
        <span className="auth-art-note-line" />
        <span className="auth-art-note-mark">✦</span>
      </div>
      <div className="auth-art-pencil" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
