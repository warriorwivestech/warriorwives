"use client";

import { SWRConfig } from "swr";
import { apiClient } from "../apiClient";

export const fetcher = async ([url, fetchOptions]: [
  string,
  RequestInit | undefined
]) => await apiClient(url, fetchOptions);

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
