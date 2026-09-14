async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json().catch(() => {});
  if (!res.ok) {
    const err = new Error(body.error || "Request failed");
    err.status = res.status; // 404, 409, 400...
    err.fieldErrors = body.errors || null; // {field: message} or null
    throw err;
  }
  return body;
}

export const lookupSample = (id) =>
  request(`/api/sample${encodeURIComponent(id.trim())}`);

export const submitSample = () =>
  request("/api/sample/submit", { method: "POST", body: JSON.stringify(data) });

export const listPanel = () => request("/api/panels");

export const listSamples = () => {
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    qs.set(key, String(value));
  }
  return request(`/api/samples?${qs}`);
};
