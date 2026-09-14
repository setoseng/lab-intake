import { useState } from "react";

import CollectionForm from "../components/CollectionForm";
import ConfirmCard from "../components/ConfirmCard";
import LookupForm from "../components/LookupForm";
import PatientSummary from "../components/PatientSummary";
import SuccessCard from "../components/SuccessCard";

// The intake flow is a straight line: lookup -> confirm -> collect -> done.
// One explicit step value keeps the three views mutually exclusive.
export default function IntakePage() {
  const [step, setStep] = useState("lookup");
  const [sample, setSample] = useState(null);
  const [submittedRecord, setSubmittedRecord] = useState(null);

  function reset() {
    setStep("lookup");
    setSample(null);
    setSubmittedRecord(null);
  }

  function handleFound(foundSample) {
    setSample(foundSample);
    setStep("confirm");
  }

  function handleSubmitted(record) {
    setSubmittedRecord(record);
    setStep("done");
  }

  if (step === "lookup") {
    return <LookupForm onFound={handleFound} />;
  }

  if (step === "confirm") {
    return (
      <ConfirmCard
        sample={sample}
        onConfirm={() => setStep("collect")}
        onChange={reset}
      />
    );
  }

  if (step === "collect") {
    return (
      <>
        <PatientSummary sample={sample} />
        <CollectionForm sample={sample} onSubmitted={handleSubmitted} />
      </>
    );
  }

  return <SuccessCard record={submittedRecord} onReset={reset} />;
}
