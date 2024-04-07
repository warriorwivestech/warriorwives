import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllGroups } from "@/data/allGroups";
import AllGroupsTable from "./components/AllGroupsTable";

export default async function AllGroups() {
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
      <TabsContent value="active">Active</TabsContent>
      <TabsContent value="archived">Active</TabsContent>
    </Tabs>
  );
}
