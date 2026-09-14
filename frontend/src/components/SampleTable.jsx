import { formatDate } from "../utils/formatDate";
import { formatSampleType } from "../utils/formatSampleType";
import { showOrDash } from "../utils/showOrDash";

const COLUMNS = [
  "Sample ID",
  "Patient",
  "Date of birth",
  "Type",
  "Status",
  "Collection date",
  "Priority",
  "Volume",
  "Notes",
];

// The list shows every seeded sample, submitted or not, so without a status
// the unsubmitted rows just look like missing data. Mirrors the backend's
// own rule: a sample is submitted once it has a collection date.
function isCollected(sample) {
  return (
    sample.collection_date !== null && sample.collection_date !== undefined
  );
}

function StatusBadge({ sample }) {
  if (isCollected(sample)) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
        Collected
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Pending
    </span>
  );
}

export default function SampleTable({ samples }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {samples.length === 0 && (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-6 text-center text-slate-500"
              >
                No samples match.
              </td>
            </tr>
          )}
          {samples.map((sample) => (
            <tr key={sample.sample_id}>
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {sample.sample_id}
              </td>
              <td className="px-4 py-3">{sample.name}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatDate(sample.date_of_birth)}
              </td>
              <td className="px-4 py-3">
                {formatSampleType(sample.sample_type)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge sample={sample} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {showOrDash(formatDate(sample.collection_date))}
              </td>
              <td className="px-4 py-3">{showOrDash(sample.priority)}</td>
              <td className="px-4 py-3">{showOrDash(sample.volume)}</td>
              <td
                className="max-w-xs truncate px-4 py-3"
                title={sample.notes ?? undefined}
              >
                {showOrDash(sample.notes)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
