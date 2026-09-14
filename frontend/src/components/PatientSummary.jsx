import { formatSampleType } from "../utils/formatSampleType";

export default function PatientSummary({ sample }) {
  return (
    <p className="mb-4 text-sm text-slate-600">
      Recording collection for{" "}
      <span className="font-medium text-slate-900">{sample.name}</span>
      {" · "}
      {sample.sample_id}
      {" · "}
      {formatSampleType(sample.sample_type)}
    </p>
  );
}
