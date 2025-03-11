import RecommendedGroups from "../../components/RecommendedGroups/RecommendedGroups";
import GroupCard from "../../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";
import { getJoinedGroups } from "../../data/joinedGroups";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { TypographyMuted } from "@/components/ui/typography/muted";
import UserVerifiedRoute from "@/components/UserVerifiedRoute";

export default async function GroupsPage() {
  const { data: groups, error } = await getJoinedGroups();

  const ExploreGroups = () => {
    return (
      <div>
        <TypographyMuted>No troops joined.</TypographyMuted>
        <Link href="/">
          <Button className="mt-4">Explore Troops</Button>
        </Link>
      </div>
    );
  };

  const GroupsData = () => {
    if (error)
      return (
        <div className="text-gray-600 text-sm">Error 14: loading troops</div>
      );
    if (!groups || groups.length === 0) return <ExploreGroups />;

    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          return <GroupCard key={group.id} {...group} />;
        })}
      </div>
    );
  };

  return (
    <UserVerifiedRoute>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <TypographyH3>My Troops</TypographyH3>
          <GroupsData />
        </div>
        <Divider />
        <div className="flex flex-col gap-6">
          <TypographyH3>Recommended Troops</TypographyH3>
          <RecommendedGroups />
        </div>
      </div>
    </UserVerifiedRoute>
  );
}
