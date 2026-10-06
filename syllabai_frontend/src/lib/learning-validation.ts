const supported: Record<string, { mime: string[]; resource: string }> = {
  pdf: { mime: ["application/pdf"], resource: "PDF" },
  png: { mime: ["image/png"], resource: "PNG image" },
  jpg: { mime: ["image/jpeg", "image/jpg"], resource: "JPEG image" },
  jpeg: { mime: ["image/jpeg", "image/jpg"], resource: "JPEG image" },
  webp: { mime: ["image/webp"], resource: "WEBP image" },
  txt: { mime: ["text/plain"], resource: "text file" },
  docx: { mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], resource: "Word document" },
};

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export function validateLearningFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const definition = supported[extension];
  if (!definition) return "Choose a PDF, PNG, JPG, JPEG, WEBP, TXT or DOCX file.";
  if (file.size === 0) return "This file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 20 MB or smaller.";
  if (file.type && !definition.mime.includes(file.type.toLowerCase())) return `The selected file does not appear to be a valid ${definition.resource}.`;
  return null;
}
