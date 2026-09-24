export type FormValues = Record<string, string | string[] | undefined | null>;

/**
 * Turns antd form values into a request body.
 * JSON when there is no file. Multipart when there is one, where tag lists become
 * a comma-separated string (that is what the Django TagListField expects from a form post).
 */
export function buildPayload(values: FormValues, file: File | null, fileField = "image"): FormValues | FormData {
  if (!file) {
    return Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined));
  }
  const body = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    body.append(key, Array.isArray(value) ? value.join(",") : value);
  }
  body.append(fileField, file);
  return body;
}
