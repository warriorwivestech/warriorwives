"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllGroupsTable from "../components/AllGroupsTable";
import ActiveGroupsTable from "../components/ActiveGroupsTable";
import ArchivedGroupsTable from "../components/ArchivedGroupsTable";
import { SWRProvider } from "@/providers/swrProvider";
import { AllGroupsDataType } from "@/app/api/groups/all/route";
import useSWR from "swr";
import AllGroupsLoading from "./AllGroupsLoading";
import CreateGroupModal from "@/components/GroupModal/AddGroup";
import EditInterestsModal from "./EditInterestsModal";

function _GroupsTables() {
  const { data, error, isLoading, mutate } = useSWR<AllGroupsDataType>([
    `/groups/all`,
  ]);

  if (isLoading) return <AllGroupsLoading />;
  if (error) return <div className="mt-4">Error loading groups</div>;

  const groups = data || [];

  return (
    <Tabs defaultValue="all-groups" className="w-full mt-4">
      <div className="flex-col-reverse flex sm:flex-row sm:justify-between sm:items-center">
        <div>
          <TabsList>
            <TabsTrigger value="all-groups">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex mb-2 sm:mb-0">
          <EditInterestsModal />
          <CreateGroupModal />
        </div>
      </div>
      <TabsContent value="all-groups">
        <AllGroupsTable groups={groups} />
      </TabsContent>
      <TabsContent value="active">
        <ActiveGroupsTable groups={groups} revalidateData={mutate} />
      </TabsContent>
      <TabsContent value="archived">
        <ArchivedGroupsTable groups={groups} revalidateData={mutate} />
      </TabsContent>
    </Tabs>
  );
}

export default function GroupsTables() {
  return (
    <SWRProvider>
      <_GroupsTables />
    </SWRProvider>
  );
}
