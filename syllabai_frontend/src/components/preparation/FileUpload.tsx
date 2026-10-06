"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";
import { validateLearningFile } from "@/lib/learning-validation";

export function FileUpload({ loading, onUpload }: { loading: boolean; onUpload: (file: File) => Promise<void> }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept(file?: File) {
    if (!file) return;
    const validation = validateLearningFile(file);
    if (validation) {
      setError(validation);
      toast.error("File not accepted", { description: validation });
      return;
    }
    setError(null);
    await onUpload(file);
  }

  function changed(event: ChangeEvent<HTMLInputElement>) {
    void accept(event.target.files?.[0]);
    event.target.value = "";
  }

  function dropped(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    void accept(event.dataTransfer.files[0]);
  }

  return (
    <div className="resource-upload-block">
      <div className="preparation-or"><span /> OR <span /></div>
      <button
        type="button"
        className={`resource-dropzone${dragging ? " resource-dropzone--active" : ""}`}
        onClick={() => input.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={dropped}
        disabled={loading}
      >
        <span className="resource-upload-icon">↑</span>
        <strong>{loading ? "Uploading privately…" : "Upload a learning resource"}</strong>
        <span>Drop a file here or browse your device</span>
        <small>PDF · PNG · JPG · WEBP · TXT · DOCX · up to 20 MB</small>
      </button>
      <input ref={input} className="visually-hidden-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx,application/pdf,image/png,image/jpeg,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={changed} />
      {error && <p className="upload-validation-error" role="alert">{error}</p>}
    </div>
  );
}
