export function getGroupEventsRequestOptions(groupId: string): RequestInit {
  return {
    // cache: "force-cache",
    next: { tags: ["group", groupId, "events"], revalidate: 60 * 5 },
  };
}
