const INPUT_CLASS =
  "rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

export default function SampleFilters({
  panels,
  sampleType,
  search,
  onSampleTypeChange,
  onSearchChange,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Options come from /api/panels so a new panel shows up here with no
          frontend change. */}
      <select
        aria-label="Filter by sample type"
        value={sampleType}
        onChange={(event) => onSampleTypeChange(event.target.value)}
        className={INPUT_CLASS}
      >
        <option value="">All types</option>
        {panels.map((panel) => (
          <option key={panel.sample_type} value={panel.sample_type}>
            {panel.display_name}
          </option>
        ))}
      </select>

      <input
        type="search"
        aria-label="Search samples"
        placeholder="Search by sample ID or name"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={`${INPUT_CLASS} flex-1 min-w-64`}
      />
    </div>
  );
}
