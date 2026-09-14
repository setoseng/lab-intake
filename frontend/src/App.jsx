import { useState } from "react";

import ConfirmCard from "./components/ConfirmCard";
import LookupForm from "./components/LookupForms";

function App() {
  const [sample, setSample] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <h1 className="text-lg font-semibold">Lab Intake</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {sample === null && <LookupForm onFound={setSample} />}

        {sample !== null && !confirmed && (
          <ConfirmCard
            sample={sample}
            onConfirm={() => setConfirmed(true)}
            onChange={() => setSample(null)}
          />
        )}

        {confirmed && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            Collection form goes here.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
