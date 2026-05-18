export function normSubjectName(name: string): string {
  return name.trim().toLowerCase();
}

export function normSubjectCategory(
  category: string | null | undefined,
): string {
  return (category ?? "").trim().toLowerCase();
}

export function subjectNameCategoryMatch(
  wantName: string,
  wantCategory: string | null | undefined,
  rowName: string,
  rowCategory: string | null | undefined,
): boolean {
  return (
    normSubjectName(rowName) === normSubjectName(wantName) &&
    normSubjectCategory(rowCategory) === normSubjectCategory(wantCategory)
  );
}
