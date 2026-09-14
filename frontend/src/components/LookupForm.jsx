import { useState } from "react";

import { lookupSample } from "../api";
import FormField from "./FormField";

export default function LookupForm({ onFound }) {
  const [sampleId, setSampleId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!sampleId.trim()) {
      setError("Sample ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const sample = await lookupSample(sampleId);
      onFound(sample);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setSampleId(event.target.value);
    setError(null); // stale error under a field they're editing is noise
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <FormField id="sample-id" label="Sample ID" error={error}>
        <div className="flex gap-3">
          <input
            id="sample-id"
            value={sampleId}
            onChange={handleChange}
            placeholder="BLD-001"
            autoFocus
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Looking up..." : "Look up"}
          </button>
        </div>
      </FormField>
    </form>
  );
}
