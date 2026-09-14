export function formatDate(isoDate) {
  // new Date(null) is the Unix epoch, not an invalid date, so the NaN check
  // below would happily format an unsubmitted sample as "January 1, 1970".
  if (isoDate === null || isoDate === undefined) {
    return null;
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  // Dates arrive as date-only ISO strings, which parse as UTC midnight.
  // Pin formatting to UTC so the shown day never slips back one in timezones
  // west of UTC.
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
