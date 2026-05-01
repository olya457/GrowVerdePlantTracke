export function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDmy(date: Date): string {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

export function readableDate(dmy: string): string {
  const [day, month, year] = dmy.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysSince(dmy: string): number {
  const [day, month, year] = dmy.split('.').map(Number);
  const start = new Date(year, month - 1, day).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((now - start) / 86400000));
}
