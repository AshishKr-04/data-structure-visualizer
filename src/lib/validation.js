export function parseNumber(value, fieldName = "Value") {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return {
      ok: false,
      error: `${fieldName} must be a valid number.`
    };
  }

  return { ok: true, value: parsed };
}

export function parseNumberList(input, minimumLength = 1) {
  const values = input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number);

  if (values.length < minimumLength) {
    return {
      ok: false,
      error: `Enter at least ${minimumLength} comma-separated number${minimumLength === 1 ? "" : "s"}.`
    };
  }

  if (values.some((value) => !Number.isFinite(value))) {
    return {
      ok: false,
      error: "Every value must be a valid number."
    };
  }

  return { ok: true, value: values };
}
