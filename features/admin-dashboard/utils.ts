export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSubmittedDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID");
}
