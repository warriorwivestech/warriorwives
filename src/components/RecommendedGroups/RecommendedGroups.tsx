"use client";

import React from "react";
import useSWR from "swr";
import GroupCard from "../GroupCards";
import { SWRProvider } from "@/providers/swrProvider";
import { Group } from "./types";
import RecommendedGroupsLoading from "./loading";

function _RecommendedGroups() {
  const fetchOptions: RequestInit = {
    next: { tags: ["groups", "recommended"] },
  };
  const {
    data: groups,
    error,
    isLoading,
  } = useSWR<Group[]>(["/groups/recommended", fetchOptions]);
  if (isLoading) return <RecommendedGroupsLoading />;
  if (error)
    return (
      <div className="text-gray-600 text-sm">
        Error loading recommended groups
      </div>
    );
  if (!groups || groups.length === 0)
    return (
      <div className="text-sm text-gray-600">
        You have joined all available groups based on your interests!
      </div>
    );

  return (
    <div className="flex flex-row gap-8 overflow-scroll overflow-y-hidden pl-1 pt-1">
      {groups.map((group) => {
        return (
          <div key={group.id} className="min-w-[330px] sm:min-w-[500px] mb-4">
            <GroupCard {...group} />
          </div>
        );
      })}
    </div>
  );
}

export default function RecommendedGroups() {
  return (
    <SWRProvider>
      <_RecommendedGroups />
    </SWRProvider>
  );
}
