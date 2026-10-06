"use client";

import type { FormEvent } from "react";

interface SearchResourceProps {
  query: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchResource({ query, loading, onQueryChange, onSearch }: SearchResourceProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }
  return (
    <form className="resource-search" onSubmit={submit}>
      <label htmlFor="learning-resource-query">Search your learning resources</label>
      <div className="resource-search-control">
        <span aria-hidden="true">⌕</span>
        <input id="learning-resource-query" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search a topic or an uploaded resource…" />
        <button className="preparation-action preparation-action--compact" type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
      </div>
      <p>Search your private resources. Selecting a resource never starts generation.</p>
    </form>
  );
}
