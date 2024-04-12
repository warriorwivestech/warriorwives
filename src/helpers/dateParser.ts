export function parseDate(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function parseEventDateTimes(
  startDateTime: string,
  endDateTime: string
) {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  // if the startDateTime and endDateTime are on the same day, only show the date once
  // e.g "Saturday, February 8, 2024, 12:00 PM to 2:00 PM"
  // if the startDateTime and endDateTime are on different days, show both dates
  // e.g "Saturday, February 8, 2024, 12:00 PM to Sunday, February 9, 2024, 2:00 PM"
  return startDate.toDateString() === endDate.toDateString()
    ? `${startDate.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true })} to ${endDate.toLocaleTimeString()}`
    : `${startDate.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true })} to ${endDate.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true })}`;
}
