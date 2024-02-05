import React from "react";
import GroupCard from "../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";
import { getGroupsByUserId } from "../data/read";
import RecommendedGroups from "../components/RecommendedGroups/RecommendedGroups";

export default async function GroupsPage() {
  // TODO: update this to use the user's actual id
  const groups = await getGroupsByUserId(1);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <p className="text-heading4">My Groups</p>
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {groups.map((group) => {
            return <GroupCard key={group.id} {...group} />;
          })}
        </SimpleGrid>
      </div>
      <Divider />
      <div className="flex flex-col gap-6">
        <p className="text-heading4">Groups you might be interested in</p>
        <RecommendedGroups />
      </div>
    </div>
  );
}
