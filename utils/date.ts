const IST = "Asia/Kolkata";

export function formatDateTimeIST(date: Date): string {
  return (
    date.toLocaleString("en-IN", {
      timeZone: IST,
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    }) + " IST"
  );
}
