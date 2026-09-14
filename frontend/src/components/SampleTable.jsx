import { formatDate } from "../utils/formatDate";
import { formatSampleType } from "../utils/formatSampleType";

const COLUMNS = [
  "Sample ID",
  "Patient",
  "Date of birth",
  "Type",
  "Collection date",
  "Priority",
  "Volume",
  "Notes",
  "Status",
];

function showOrDash(value) {
  return value === null || value === undefined ? "—" : value;
}

function formatCollectionDate(value) {
  return value === null ? "—" : formatDate(value);
}

// A sample is submitted once it has a collection date; there is no separate
// status field in the database.
function formatStatus(sample) {
  return sample.collection_date === null ? "Pending" : "Submitted";
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
                {formatCollectionDate(sample.collection_date)}
              </td>
              <td className="px-4 py-3">{showOrDash(sample.priority)}</td>
              <td className="px-4 py-3">{showOrDash(sample.volume)}</td>
              <td
                className="max-w-xs truncate px-4 py-3"
                title={sample.notes ?? undefined}
              >
                {showOrDash(sample.notes)}
              </td>
              <td className="px-4 py-3">{formatStatus(sample)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
