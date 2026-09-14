import { useState } from "react";
import { lookupSample } from "../api";

export default function LookupForm({ onFound }) {
  const [sampleId, setSampleId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
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

  function handleChange(e) {
    setSampleId(e.target.value);
    setError(null); // stale error under a field they're editing is noise
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="sample-id">Sample ID</label>
      <input
        id="sample-id"
        value={sampleId}
        onChange={handleChange}
        placeholder="BLD-001"
        autoFocus
      />
      <button type="submit" disabled={loading || !sampleId.trim()}>
        {loading ? "Looking up..." : "Look up"}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </form>
  );
}
