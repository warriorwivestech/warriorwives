export function getUserRequestOptions(): RequestInit {
  return {
    next: { tags: ["user"] },
  };
}
