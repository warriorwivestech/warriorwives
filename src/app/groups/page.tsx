import RecommendedGroups from "../../components/RecommendedGroups/RecommendedGroups";
import GroupCard from "../../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";
import { getJoinedGroups } from "../../data/joinedGroups";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { TypographyMuted } from "@/components/ui/typography/muted";

export default async function GroupsPage() {
  const { data: groups, error } = await getJoinedGroups();

  const ExploreGroups = () => {
    return (
      <div>
        <TypographyMuted>No groups joined.</TypographyMuted>
        <Link href="/">
          <Button className="mt-4">Explore Groups</Button>
        </Link>
      </div>
    );
  };

  const GroupsData = () => {
    if (error) return <div>Error loading groups</div>;
    if (!groups || groups.length === 0) return <ExploreGroups />;

    return (
      <SimpleGrid minChildWidth="330px" columns={[1, 2, 3]} spacing={6}>
        {groups.map((group) => {
          return <GroupCard key={group.id} {...group} />;
        })}
      </SimpleGrid>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <TypographyH3>My Groups</TypographyH3>
        <GroupsData />
      </div>
      <Divider />
      <div className="flex flex-col gap-6">
        <TypographyH3>Recommended Groups</TypographyH3>
        <RecommendedGroups />
      </div>
    </div>
  );
}
