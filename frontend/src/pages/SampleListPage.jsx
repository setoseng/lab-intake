import { useEffect, useState } from "react";

import { listPanels, listSamples } from "../api";
import ErrorBanner from "../components/ErrorBanner";
import SampleFilters from "../components/SampleFilters";
import SampleTable from "../components/SampleTable";

export default function SampleListPage() {
  const [panels, setPanels] = useState([]);
  const [samples, setSamples] = useState([]);
  const [sampleType, setSampleType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPanels() {
      try {
        const body = await listPanels();
        setPanels(body.panels);
      } catch (err) {
        setError(err.message);
      }
    }
    loadPanels();
  }, []);

  useEffect(() => {
    // Filters can change faster than responses return; ignore any response
    // that belongs to a filter set the user has already moved past.
    let ignore = false;

    async function loadSamples() {
      setLoading(true);
      setError(null);
      try {
        const body = await listSamples({ sample_type: sampleType, search });
        if (!ignore) {
          setSamples(body.samples);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadSamples();

    return () => {
      ignore = true;
    };
  }, [sampleType, search]);

  return (
    <div className="space-y-4">
      <SampleFilters
        panels={panels}
        sampleType={sampleType}
        search={search}
        onSampleTypeChange={setSampleType}
        onSearchChange={setSearch}
      />
      <ErrorBanner message={error} />
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {!loading && !error && <SampleTable samples={samples} />}
    </div>
  );
}
