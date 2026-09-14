import { Link } from "react-router-dom";

import { formatDate } from "../utils/formatDate";
import { formatSampleType } from "../utils/formatSampleType";

function showOrDash(value) {
  return value === null || value === undefined ? "—" : value;
}

export default function SuccessCard({ record, onReset }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Collection recorded</h2>
      <p className="mt-1 text-sm text-slate-500">
        {record.name} · {record.sample_id} ·{" "}
        {formatSampleType(record.sample_type)}
      </p>

      {/* These values are what the backend read back after writing, not the
          payload we sent, so this card shows what was actually stored. */}
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Collection date</dt>
          <dd className="font-medium">{formatDate(record.collection_date)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Priority</dt>
          <dd className="font-medium">{showOrDash(record.priority)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Volume</dt>
          <dd className="font-medium">{showOrDash(record.volume)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Notes</dt>
          <dd className="font-medium">{showOrDash(record.notes)}</dd>
        </div>
      </dl>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Record another sample
        </button>
        <Link
          to="/samples"
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          View samples
        </Link>
      </div>
    </div>
  );
}
