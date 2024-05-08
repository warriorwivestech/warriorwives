import { Flex, Skeleton } from "@chakra-ui/react";
import { SWRResponse } from "swr";
import { PublicGroupMembers } from "@/app/api/groups/[groupId]/members/public/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GroupMembersData({
  members,
}: {
  members: SWRResponse<PublicGroupMembers, any, any>;
}) {
  const { data, error, isLoading } = members;

  if (isLoading)
    return (
      <div className="w-full lg:w-[65%] flex flex-col gap-2">
        <Skeleton height="60px" className="rounded-sm" />
        <Skeleton height="60px" className="rounded-sm" />
        <Skeleton height="60px" className="rounded-sm" />
      </div>
    );
  if (error)
    return <div className="text-sm text-gray-600">Error loading members</div>;

  const sortedMembers = data
    ? data.sort((a, b) => {
        if (a.admin && !b.admin) return -1;
        if (!a.admin && b.admin) return 1;

        const aName = a.name as string;
        const bName = b.name as string;
        return aName.localeCompare(bName);
      })
    : [];

  return (
    <Flex className="flex-col w-full lg:w-[65%] pt-4">
      {sortedMembers.length > 0 ? (
        sortedMembers.map((member) => {
          const { name } = member;

          return (
            <Link
              href={`/members/${member.id}`}
              key={member.id}
              className="w-full transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      alt={name as string}
                      src={member.image as string}
                    />
                    <AvatarFallback>
                      {name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-md font-medium">{name}</h4>
                    <p className="text-sm text-gray-500">
                      {member.admin ? "Admin" : "Member"}
                    </p>
                  </div>
                </div>
                <Button className="ml-4">View</Button>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="text-sm text-gray-600 mt-2">
          No members found for this group.
        </div>
      )}
    </Flex>
  );
}
