"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { UserRole } from "@/types/auth";
import { ApiRequestError } from "@/lib/api";
import { cancelPreparation, createPreparation, getPreparation, getResource, searchResources, uploadResource } from "@/lib/learning-api";
import type { LearningResource, PreparationApi, PreparationOptions, PreparationRequest, PreparationType } from "@/types/learning";

function errorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    const validation = Object.values(error.errors).flatMap((messages) => Array.isArray(messages) ? messages : [messages]).join(" ");
    return validation ? `${error.message} ${validation}` : error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function resultTitle(preparation: PreparationRequest): string {
  const title = preparation.result.title;
  return typeof title === "string" ? title : "Open your prepared learning material.";
}

export function usePreparationWorkflow(role: UserRole): PreparationApi {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [preparationTypes, setPreparationTypes] = useState<PreparationType[]>([]);
  const [preparations, setPreparations] = useState<PreparationRequest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const preparationsRef = useRef(preparations);
  useEffect(() => {
    preparationsRef.current = preparations;
  }, [preparations]);
  const [query, setQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingPreparation, setLoadingPreparation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedResourceId = selectedResource?.id;
  const selectedResourceStatus = selectedResource?.status;
  const activePreparationKey = preparations
    .filter((item) => item.status === "pending" || item.status === "processing")
    .map((item) => `${item.id}:${item.status}`)
    .sort()
    .join("|");

  const reportError = useCallback((caught: unknown) => {
    const message = errorMessage(caught);
    setError(message);
    toast.error(message);
  }, []);

  const search = useCallback(async () => {
    setLoadingSearch(true);
    setHasSearched(true);
    setError(null);
    try {
      setResources(await searchResources(role, query.trim()));
    } catch (caught) {
      reportError(caught);
    } finally {
      setLoadingSearch(false);
    }
  }, [query, reportError, role]);

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
    setHasSearched(false);
    setResources([]);
  }, []);

  const upload = useCallback(async (file: File) => {
    setLoadingUpload(true);
    setError(null);
    try {
      const resource = await uploadResource(role, file);
      setSelectedResource(resource);
      setPreparations([]);
      toast.success("Upload received", { description: "We’re privately processing your resource." });
    } catch (caught) {
      reportError(caught);
    } finally {
      setLoadingUpload(false);
    }
  }, [reportError, role]);

  const selectResource = useCallback((resource: LearningResource) => {
    setSelectedResource(resource);
    setPreparations([]);
    setError(null);
  }, []);

  const prepare = useCallback(async (optionsByType: Partial<Record<PreparationType, PreparationOptions>>, requestedTypes = preparationTypes) => {
    if (!selectedResource || selectedResource.status !== "ready") {
      reportError(new Error("Select a resource that has finished processing first."));
      return;
    }
    if (requestedTypes.length === 0) {
      reportError(new Error("Choose at least one preparation type."));
      return;
    }
    setLoadingPreparation(true);
    setError(null);
    try {
      const settled = await Promise.allSettled(requestedTypes.map((type) =>
        createPreparation(role, selectedResource.id, type, optionsByType[type] ?? {}),
      ));
      const created = settled.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
      setPreparations((current) => [...created, ...current]);
      const failures = settled.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        const firstFailure = failures[0];
        reportError(firstFailure.status === "rejected" ? firstFailure.reason : new Error("A preparation could not be queued."));
      }
      if (created.some((item) => item.status === "pending" || item.status === "processing")) {
        toast.success(`${created.length} preparation${created.length === 1 ? "" : "s"} started`, { description: "You can follow each result here while they run in the background." });
      } else if (created.length > 0) {
        toast.success("Your materials are ready", { description: created.map(resultTitle).join(", ") });
      }
    } catch (caught) {
      reportError(caught);
    } finally {
      setLoadingPreparation(false);
    }
  }, [preparationTypes, reportError, role, selectedResource]);

  const cancel = useCallback(async (preparationId: string) => {
    try {
      const cancelled = await cancelPreparation(role, preparationId);
      setPreparations((current) => current.map((item) => item.id === preparationId ? cancelled : item));
      toast.message("Preparation cancelled");
    } catch (caught) {
      reportError(caught);
    }
  }, [reportError, role]);

  const reset = useCallback(() => {
    setSelectedResource(null);
    setPreparations([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (!selectedResourceId || selectedResourceStatus !== "processing") return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const resource = await getResource(role, selectedResourceId);
        if (!active) return;
        setSelectedResource(resource);
        if (resource.status === "ready") toast.success("Resource ready", { description: "Choose your options and prepare your material." });
        if (resource.status === "failed") toast.error(resource.processing_error || "We couldn’t read this resource.");
        if (resource.status === "processing") timer = setTimeout(() => void poll(), 1600);
      } catch (caught) {
        if (active) {
          reportError(caught);
          timer = setTimeout(() => void poll(), 3000);
        }
      }
    };
    timer = setTimeout(() => void poll(), 900);
    return () => { active = false; clearTimeout(timer); };
  }, [reportError, role, selectedResourceId, selectedResourceStatus]);

  useEffect(() => {
    if (!activePreparationKey) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const activeJobs = preparationsRef.current.filter((item) => item.status === "pending" || item.status === "processing");
        const latestJobs = await Promise.all(activeJobs.map((item) => getPreparation(role, item.id)));
        if (!active) return;
        setPreparations((current) => current.map((item) => latestJobs.find((latest) => latest.id === item.id) ?? item));
        for (const latest of latestJobs) {
          const oldStatus = activeJobs.find((item) => item.id === latest.id)?.status;
          if (latest.status === "completed" && oldStatus !== "completed") toast.success(`${latest.preparation_type.replace("_", " ")} ready`, { description: resultTitle(latest) });
          else if (latest.status === "failed" && oldStatus !== "failed") toast.error(latest.error_message || `${latest.preparation_type} preparation could not be completed.`);
        }
        if (latestJobs.some((latest) => latest.status === "processing" || latest.status === "pending")) timer = setTimeout(() => void poll(), 1400);
      } catch (caught) {
        if (active) {
          reportError(caught);
          timer = setTimeout(() => void poll(), 3000);
        }
      }
    };
    timer = setTimeout(() => void poll(), 1100);
    return () => { active = false; clearTimeout(timer); };
  }, [activePreparationKey, reportError, role]);

  return { role, resources, selectedResource, preparationTypes, preparations, query, hasSearched, loadingSearch, loadingUpload, loadingPreparation, error, setQuery: updateQuery, setPreparationTypes, search, upload, selectResource, prepare, cancel, reset };
}
