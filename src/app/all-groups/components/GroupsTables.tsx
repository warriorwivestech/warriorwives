import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllGroups } from "@/data/allGroups";
import AllGroupsTable from "../components/AllGroupsTable";
import ActiveGroupsTable from "../components/ActiveGroupsTable";
import ArchivedGroupsTable from "../components/ArchivedGroupsTable";

export default async function GroupsTables() {
  const { data: groups, error } = await getAllGroups();

  return (
    <Tabs defaultValue="all-groups" className="w-full">
      <TabsList>
        <TabsTrigger value="all-groups">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all-groups">
        <AllGroupsTable groups={groups} error={error} />
      </TabsContent>
      <TabsContent value="active">
        <ActiveGroupsTable groups={groups} error={error} />
      </TabsContent>
      <TabsContent value="archived">
        <ArchivedGroupsTable groups={groups} error={error} />
      </TabsContent>
    </Tabs>
  );
}
