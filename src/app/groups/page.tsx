import RecommendedGroups from "../components/RecommendedGroups/RecommendedGroups";
import GroupCard from "../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";
import { getJoinedGroups } from "../data/groups";

export default async function GroupsPage() {
  // TODO: update this to use the user's actual id
  const { data: groups, error } = await getJoinedGroups(3);

  const GroupsData = () => {
    if (error) return <div>Error loading groups</div>;
    if (!groups || groups.length === 0)
      return <div>You have not joined any groups yet.</div>;

    return (
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {groups.map((group) => {
          return <GroupCard key={group.id} {...group} />;
        })}
      </SimpleGrid>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <p className="text-heading4">My Groups</p>
        <GroupsData />
      </div>
      <Divider />
      <div className="flex flex-col gap-6">
        <p className="text-heading4">Groups you might be interested in</p>
        <RecommendedGroups />
      </div>
    </div>
  );
}
