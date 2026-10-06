"use client";

import { useState } from "react";
import { FileUpload } from "@/components/preparation/FileUpload";
import { OutputTypeSelector } from "@/components/preparation/OutputTypeSelector";
import { PreparationOptions } from "@/components/preparation/PreparationOptions";
import { PreparationResult } from "@/components/preparation/PreparationResult";
import { ProcessingStatus } from "@/components/preparation/ProcessingStatus";
import { ResourceResults } from "@/components/preparation/ResourceResults";
import { SearchResource } from "@/components/preparation/SearchResource";
import type { PreparationApi, PreparationOptions as Options, PreparationType } from "@/types/learning";

export function PreparationWorkspace({ workflow }: { workflow: PreparationApi }) {
  const { role, selectedResource, preparations } = workflow;
  const [optionsByType, setOptionsByType] = useState<Partial<Record<PreparationType, Options>>>({});
  const roleName = role === "teacher" ? "teaching" : "learning";
  const processingResource = selectedResource?.status === "processing" || selectedResource?.status === "uploaded";
  const hasActiveJobs = preparations.some((item) => item.status === "pending" || item.status === "processing");
  const otherRequestIsValid = !workflow.preparationTypes.includes("other")
    || Boolean(optionsByType.other?.other_request && optionsByType.other.other_request.trim().length >= 5);

  return (
    <main className={`preparation-page preparation-page--${role}`}>
      <header className="preparation-page-header">
        <div><span className="eyebrow">YOUR {role === "teacher" ? "TEACHER" : "STUDENT"} SPACE</span><h1>Prepare learning material</h1><p>Search a source or upload your own, then shape it into something useful.</p></div>
        <span className="preparation-private-mark">⌑ &nbsp; Private to your {roleName} space</span>
      </header>

      {preparations.length === 0 && !selectedResource && <>
        <section className="preparation-source-panel">
          <div className="preparation-source-heading"><span className="preparation-source-number">01</span><div><span className="eyebrow">CHOOSE A SOURCE</span><h2>Start with learning material</h2></div></div>
          <SearchResource query={workflow.query} loading={workflow.loadingSearch} onQueryChange={workflow.setQuery} onSearch={() => void workflow.search()} />
          {workflow.hasSearched && <ResourceResults resources={workflow.resources} onSelect={workflow.selectResource} />}
          {workflow.loadingSearch && <p className="preparation-inline-status">Looking through your ready resources…</p>}
          <FileUpload loading={workflow.loadingUpload} onUpload={workflow.upload} />
        </section>
      </>}

      {selectedResource && preparations.length === 0 && <section className="selected-resource-panel">
        <div className="selected-resource-card"><span className="resource-file-mark">{selectedResource.resource_type.toUpperCase()}</span><div><span className="eyebrow">SELECTED RESOURCE</span><h2>{selectedResource.title}</h2><p>{selectedResource.preview || selectedResource.description || (selectedResource.file_size ? `${Math.ceil(selectedResource.file_size / 1024)} KB` : "Uploaded learning material")}</p></div><button type="button" className="text-action" onClick={workflow.reset}>Change source</button></div>
        {processingResource && <div className="processing-card" aria-live="polite"><span className="eyebrow">SOURCE PROCESSING</span><h2>Reading your resource…</h2><p>Text extraction is running in the background. You can choose what to prepare once it is ready.</p><div className="preparation-progress-track"><span className="preparation-progress-indeterminate" /></div></div>}
        {selectedResource.status === "failed" && <div className="resource-processing-error" role="alert"><strong>We couldn’t read this resource.</strong><p>{selectedResource.processing_error || "Check that the file is readable and try uploading it again."}</p><button type="button" className="text-action" onClick={workflow.reset}>Choose another resource</button></div>}
        {selectedResource.status === "ready" && <>
          <OutputTypeSelector value={workflow.preparationTypes} onChange={workflow.setPreparationTypes} />
          {workflow.preparationTypes.length > 0 && <div className="preparation-multi-options">
            <div className="preparation-options-heading"><span className="eyebrow">CONFIGURE EACH OUTPUT</span><h3>{workflow.preparationTypes.length} output{workflow.preparationTypes.length === 1 ? "" : "s"} selected</h3></div>
            {workflow.preparationTypes.map((type) => <PreparationOptions key={type} type={type} disabled={workflow.loadingPreparation} onPrepare={async () => undefined} showSubmit={false} onOptionsChange={(options) => setOptionsByType((current) => ({ ...current, [type]: options }))} />)}
            <button type="button" className="preparation-action preparation-submit" disabled={workflow.loadingPreparation || !otherRequestIsValid} onClick={() => void workflow.prepare(optionsByType)}>{workflow.loadingPreparation ? "Starting selected outputs…" : `Prepare ${workflow.preparationTypes.length} selected output${workflow.preparationTypes.length === 1 ? "" : "s"}`}<span>✦</span></button>
          </div>}
        </>}
      </section>}

      {preparations.length > 0 && <section className="preparation-run-panel">
        <div className="preparation-run-resource"><span className="resource-file-mark">{preparations[0].resource.resource_type.toUpperCase()}</span><div><span className="eyebrow">SOURCE MATERIAL · {preparations.length} OUTPUT{preparations.length === 1 ? "" : "S"}</span><strong>{preparations[0].resource.title}</strong></div>{!hasActiveJobs && <button className="text-action" type="button" onClick={workflow.reset}>Prepare another</button>}</div>
        {preparations.map((preparation) => <article className="preparation-job-card" key={preparation.id}>
          <ProcessingStatus preparation={preparation} onCancel={() => void workflow.cancel(preparation.id)} />
          {preparation.status === "completed" && <PreparationResult preparation={preparation} role={role} />}
          {preparation.status === "failed" && <button type="button" className="preparation-action" onClick={() => void workflow.prepare({ [preparation.preparation_type]: preparation.options }, [preparation.preparation_type])}>Try {preparation.preparation_type.replace("_", " ")} again <span>↻</span></button>}
        </article>)}
      </section>}
      {workflow.error && <p className="preparation-inline-error" role="alert">{workflow.error}</p>}
      <footer className="preparation-page-footer"><span>Search works before choosing an output. Select one or more outputs after choosing your resource.</span><span>Files stay private to your account.</span></footer>
    </main>
  );
}
