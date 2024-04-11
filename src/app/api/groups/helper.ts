export function getSingleGroupRequestOptions(groupId: string): RequestInit {
  return {
    // cache: "force-cache",
    next: { tags: ["group", groupId], revalidate: 60 * 5 },
  };
}
