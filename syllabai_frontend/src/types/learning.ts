export type { UserRole } from "@/types/auth";
import type { UserRole } from "@/types/auth";

export type PreparationType = "quiz" | "short_note" | "flashcard" | "image" | "animation" | "other";
export type ResourceType = "pdf" | "image" | "txt" | "docx" | "external";
export type PreparationStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type ResourceStatus = "uploaded" | "processing" | "ready" | "failed";
export type ImageMode = "source_image" | "extracted_image" | "diagram" | "infographic" | "illustration" | "flowchart";

export interface LearningResource {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  source_type: "upload" | "external" | "generated";
  source_url: string;
  source_provider: string;
  license_name: string;
  mime_type: string;
  file_size: number;
  status: ResourceStatus;
  processing_error: string;
  resource_version: number;
  page_count: number | null;
  chunk_count: number | null;
  preview: string;
  file_url: string | null;
  relevant_pages: number[];
  created_at: string;
  updated_at: string;
}

export type SearchResult = LearningResource;

export interface PreparationOptions {
  count?: number;
  difficulty?: string;
  question_types?: Array<"mcq" | "true_false" | "fill_in_blank">;
  topic?: string;
  language?: string;
  length?: "short" | "medium" | "long";
  style?: string;
  image_mode?: ImageMode;
  labels?: boolean;
  aspect_ratio?: "1:1" | "4:3" | "16:9" | "9:16";
  duration?: number;
  animation_type?: "concept_explanation" | "process" | "timeline";
  other_request?: string;
  other_format?: "study_guide" | "glossary" | "outline" | "practice_prompts";
  reviews?: Record<string, string>;
  [key: string]: unknown;
}

export interface PreparationRequest {
  id: string;
  resource: LearningResource;
  preparation_type: PreparationType;
  status: PreparationStatus;
  options: PreparationOptions;
  result: Record<string, unknown>;
  error_message: string;
  generator_version: string;
  prompt_version: string;
  model_name: string;
  created_at: string;
  completed_at: string | null;
  progress: { step: number; total: number; label: string };
}

export interface PreparationResult extends Record<string, unknown> {
  title: string;
}

export interface PreparationApi {
  role: UserRole;
  resources: LearningResource[];
  selectedResource: LearningResource | null;
  preparationTypes: PreparationType[];
  preparations: PreparationRequest[];
  query: string;
  hasSearched: boolean;
  loadingSearch: boolean;
  loadingUpload: boolean;
  loadingPreparation: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  setPreparationTypes: (types: PreparationType[]) => void;
  search: () => Promise<void>;
  upload: (file: File) => Promise<void>;
  selectResource: (resource: LearningResource) => void;
  prepare: (options: Partial<Record<PreparationType, PreparationOptions>>, types?: PreparationType[]) => Promise<void>;
  cancel: (preparationId: string) => Promise<void>;
  reset: () => void;
}

export interface NoteContent {
  title: string;
  summary: string;
  key_points: string[];
  important_terms: Array<{ term: string; meaning: string }>;
  paragraph?: string;
  grounding?: string;
  language?: string;
  style?: string;
}

export interface QuizQuestion {
  id: number | string;
  type: "mcq" | "true_false" | "fill_in_blank";
  question: string;
  answer: string;
  explanation: string;
  choices?: string[];
  source_chunk?: number;
}

export interface QuizContent {
  title: string;
  count: number;
  difficulty: string;
  questions: QuizQuestion[];
  grounding?: string;
}

export interface QuizAttemptResult {
  score: number;
  total: number;
  percentage: number;
  review: Array<{
    id: number | string;
    question: string;
    type: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }>;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  source_sentence?: number;
}

export interface FlashcardContent {
  title: string;
  count: number;
  difficulty: string;
  cards: FlashcardItem[];
  grounding?: string;
}

export interface FlashcardReviewStats {
  total: number;
  reviewed: number;
  known: number;
  need_review: number;
  reviews?: Record<string, string>;
}

export interface ImageContent {
  title: string;
  image_mode: ImageMode;
  style?: string;
  aspect_ratio?: string;
  mime_type: string;
  svg?: string;
  image_data?: string;
  image_url?: string;
  alt?: string;
  grounding?: string;
}

export interface AnimationScene {
  type: string;
  duration: number;
  narration: string;
  visual: string;
  source_chunk?: number;
}

export interface AnimationContent {
  title: string;
  duration: number;
  style?: string;
  difficulty?: string;
  scenes: AnimationScene[];
  grounding?: string;
  image_url?: string;
}

export interface DashboardSummary {
  resources_count?: number;
  quizzes_count?: number;
  flashcards_count?: number;
  notes_count?: number;
  animations_count?: number;
  images_count?: number;
  students_count?: number;
  recent_resources?: LearningResource[];
  recent_materials?: LearningResource[];
  recent_preparations?: PreparationRequest[];
  recent_activity?: PreparationRequest[];
  continue_learning?: PreparationRequest[];
}

export interface DashboardData {
  role: UserRole;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
  };
  summary: DashboardSummary;
}

