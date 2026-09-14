import { formatDate } from "../utils/formatDate";
import { formatSampleType } from "../utils/formatSampleType";

export default function ConfirmCard({ sample, onConfirm, onChange }) {
  const isSubmitted = sample.is_submitted;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{sample.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Confirm this is the correct patient before recording collection.
          </p>
        </div>
        <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {formatSampleType(sample.sample_type)}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Sample ID</dt>
          <dd className="font-medium">{sample.sample_id}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Date of birth</dt>
          <dd className="font-medium">{formatDate(sample.date_of_birth)}</dd>
        </div>
      </dl>

      {isSubmitted && (
        <p
          role="status"
          className="mt-4 rounded bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          This sample already has a collection on record and cannot be
          resubmitted.
        </p>
      )}

      <div className="mt-6 flex gap-3">
        {/* Block re-entry into collection for an already-submitted sample: the
            backend answers a resubmit with 409, so we stop it at the door. */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitted}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm patient
        </button>
        <button
          type="button"
          onClick={onChange}
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Change
        </button>
      </div>
    </div>
  );
}
