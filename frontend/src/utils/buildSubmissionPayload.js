function blankToNull(value) {
  return value.trim() === "" ? null : value.trim();
}

// Form inputs hold strings. The backend stores blanks as None, so send null
// rather than "" and never coerce a blank volume: Number("") is 0, which would
// trip "Volume must be greater than zero" on an optional field.
export function buildSubmissionPayload(sampleId, values) {
  const volume = blankToNull(values.volume);

  return {
    sample_id: sampleId,
    collection_date: values.collection_date,
    priority: blankToNull(values.priority),
    volume: volume === null ? null : Number(volume),
    notes: blankToNull(values.notes),
  };
}
