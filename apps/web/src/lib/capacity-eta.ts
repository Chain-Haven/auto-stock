/**
 * Capacity ETA: estimate completion date given units_per_day and blackout dates.
 */

export function addBusinessDays(start: Date, days: number, blackoutDates: Date[]): Date {
  const set = new Set(blackoutDates.map((d) => d.toDateString()));
  let d = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    if (!set.has(d.toDateString())) remaining--;
  }
  return d;
}

export function capacityEta(
  unitsRemaining: number,
  unitsPerDay: number,
  startDate: Date,
  blackoutDates: Date[]
): Date {
  if (unitsPerDay <= 0) return startDate;
  const days = Math.ceil(unitsRemaining / unitsPerDay);
  return addBusinessDays(startDate, days, blackoutDates);
}
