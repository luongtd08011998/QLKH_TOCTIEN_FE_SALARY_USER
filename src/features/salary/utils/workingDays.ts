/** Business rule: "ngày công" = số ngày trong tháng - số Chủ nhật. */
export function calcNgayCongFromYearMonth(yearMonth: string): number | null {
  if (!/^\d{6}$/.test(yearMonth)) return null;
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(4, 6), 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  let sundays = 0;
  for (let day = 1; day <= daysInMonth; day += 1) {
    // monthIndex is 0-based
    if (new Date(year, month - 1, day).getDay() === 0) sundays += 1;
  }
  return daysInMonth - sundays;
}

