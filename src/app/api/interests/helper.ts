export function getInterestsRequestOptions(): RequestInit {
  return {
    next: { tags: ["interests"] },
  };
}
