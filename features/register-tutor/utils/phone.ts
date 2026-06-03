export function sanitizePhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneNumberForServer(value: string) {
  const digitsOnly = sanitizePhoneNumber(value);

  if (!digitsOnly) return "";
  if (digitsOnly.startsWith("62")) return `+${digitsOnly}`;
  if (digitsOnly.startsWith("0")) return `+62${digitsOnly.slice(1)}`;

  return `+62${digitsOnly}`;
}
