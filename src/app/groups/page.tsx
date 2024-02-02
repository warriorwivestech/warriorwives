import React from "react";
import GroupCard from "../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";
import { getGroupsByUserId } from "../data/read";
import { sampleGroupData } from "../data/samples";

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
        <p className="text-heading3">Groups you might be interested in</p>
        <div className="flex flex-row gap-8 overflow-scroll overflow-y-hidden">
          {sampleGroupData.map((group, index) => {
            return (
              <div key={index} className="min-w-[330px] sm:min-w-[500px] mb-4">
                <GroupCard {...group} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
