export function nextOccurrence(dayOfWeek: number, timeStr: string): Date {
  const now = new Date();
  const todayDow = now.getDay();
  let daysUntil = (dayOfWeek - todayDow + 7) % 7;

  if (daysUntil === 0) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const slotMinutes = hour * 60 + minute;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (slotMinutes <= nowMinutes) daysUntil = 7;
  }

  const date = new Date(now);
  date.setDate(now.getDate() + daysUntil);

  const [hour, minute, second] = timeStr.split(":").map(Number);
  date.setHours(hour, minute, second ?? 0, 0);

  return date;
}
