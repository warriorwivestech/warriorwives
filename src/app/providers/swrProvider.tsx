"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource: string, init: RequestInit | undefined) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}${resource}`, init).then((res) => res.json()),
      }}
    >
      {children}
    </SWRConfig>
  );
}
