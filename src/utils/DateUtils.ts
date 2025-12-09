export const formatRelativeTime = (
  isoString: string | null | undefined
): string => {
  if (!isoString) return "N/A";

  const then = new Date(isoString);
  if (Number.isNaN(then.getTime())) return "N/A";

  const now = Date.now();
  let diffMs = now - then.getTime();

  if (diffMs < 0) diffMs = 0;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 1) {
    if (diffHours >= 1) {
      return `${diffHours}h ago`;
    }
    const mins = Math.max(diffMinutes, 0);
    if (mins <= 1) return "1min ago";
    return `${mins}min ago`;
  }

  // 1–29 days → days
  if (diffDays < 30) {
    return `${diffDays}` + (diffDays !== 1 ? " days ago" : "day ago");
  }

  // 1–11 months → months
  if (diffMonths < 12) {
    return `${diffMonths}` + (diffMonths !== 1 ? " months ago" : "month ago");
  }

  // ≥ 1 year → years
  return `${diffYears}` + (diffYears !== 1 ? " years ago" : "year ago");
};
