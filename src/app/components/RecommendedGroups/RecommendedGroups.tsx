"use client";

import React from "react";
import useSWR from "swr";
import GroupCard from "../GroupCards";
import { SWRProvider } from "@/app/providers/swrProvider";
import { Group } from "./types";
import RecommendedGroupsLoading from "./loading";

function _RecommendedGroups() {
  const fetchOptions: RequestInit = {
    cache: "force-cache",
    next: { tags: ["groups", "recommended"], revalidate: 60 * 5 },
  };
  const {
    data: groups,
    error,
    isLoading,
  } = useSWR<Group[]>(["/groups/recommended", fetchOptions]);
  if (isLoading) return <RecommendedGroupsLoading />;
  if (error) return <div>Error loading recommended groups</div>;
  if (!groups || groups.length === 0)
    return (
      <div>You have joined all available groups based on your interests!</div>
    );

  return (
    <div className='flex flex-row gap-8 overflow-scroll overflow-y-hidden'>
      {groups.map((group) => {
        return (
          <div key={group.id} className='min-w-[330px] sm:min-w-[500px] mb-4'>
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
