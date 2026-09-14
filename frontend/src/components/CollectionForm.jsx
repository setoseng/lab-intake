import { useState } from "react";

import { submitSample } from "../api";
import { buildSubmissionPayload } from "../utils/buildSubmissionPayload";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";

// The spec fixes this enum on the Sample entity, so it is contract, not
// configuration. Which panels *require* it still comes from the backend.
const PRIORITY_OPTIONS = ["high", "medium", "low"];

const EMPTY_VALUES = {
  collection_date: "",
  priority: "",
  volume: "",
  notes: "",
};

const INPUT_CLASS =
  "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

export default function CollectionForm({ sample, onSubmitted }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // A stale error under a field they're editing is noise.
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setRequestError(null);
    setFieldErrors({});
    try {
      const record = await submitSample(
        buildSubmissionPayload(sample.sample_id, values),
      );
      onSubmitted(record);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else {
        setRequestError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <FormField
        id="collection_date"
        label="Collection date"
        error={fieldErrors.collection_date}
      >
        <input
          id="collection_date"
          name="collection_date"
          type="date"
          value={values.collection_date}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </FormField>

      {/* Priority and volume are shown because the sample's panel flags say
          so, never because of the sample type's name. */}
      {sample.requires_priority && (
        <FormField id="priority" label="Priority" error={fieldErrors.priority}>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className={INPUT_CLASS}
          >
            <option value="">Select priority</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      )}

      {sample.requires_volume && (
        <FormField id="volume" label="Volume" error={fieldErrors.volume}>
          <input
            id="volume"
            name="volume"
            type="number"
            min="1"
            step="1"
            value={values.volume}
            onChange={handleChange}
            className={INPUT_CLASS}
          />
        </FormField>
      )}

      <FormField id="notes" label="Notes (optional)" error={fieldErrors.notes}>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </FormField>

      <ErrorBanner message={requestError} />

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Submitting..." : "Submit collection"}
      </button>
    </form>
  );
}
