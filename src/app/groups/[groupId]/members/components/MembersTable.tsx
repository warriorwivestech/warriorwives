"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserDataType } from "@/data/user";
import { parseDate } from "@/helpers/dateParser";
import DemoteModal from "./DemoteModal";
import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import { GroupMembers } from "@/app/api/groups/[groupId]/members/route";
import PromoteModal from "./PromoteModal";
import RemoveModal from "./RemoveModal";
import LoadingMembersTable from "./LoadingMembersTable";

interface MembersTableProps {
  user: UserDataType;
  userIsAdmin: boolean;
  groupData: {
    id: number;
    name: string;
  };
}

function _MembersTables({ user, userIsAdmin, groupData }: MembersTableProps) {
  const { id: groupId } = groupData;
  const { data, error, isLoading, mutate } = useSWR<GroupMembers>([
    `/groups/${groupId}/members`,
  ]);

  if (isLoading) return <LoadingMembersTable />;
  if (error) return <div className="mt-4">Error loading members</div>;

  // sort members by admin on top, then by name
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
    <Table className="mt-4">
      <TableCaption>All members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Branch of Service</TableHead>
          <TableHead className="min-w-[140px]">Joined On</TableHead>
          <TableHead className="min-w-[240px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMembers.map((member) => {
          // a superUser can remove any member (admin or normal members)
          // admins can remove normal members but not admins
          const userCanRemove =
            user.superUser || (userIsAdmin && !member.admin);
          // admins or superUsers can promote normal members to admin
          const userCanPromote =
            user.superUser || (userIsAdmin && !member.admin);
          // only superUsers can demote admins
          const userCanDemote = user.superUser;

          return (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.admin ? "Admin" : "Member"}</TableCell>
              <TableCell>{member.branch}</TableCell>
              <TableCell>{parseDate(member.createdAt)}</TableCell>
              <TableCell>
                {userCanPromote && !member.admin && (
                  <PromoteModal
                    member={member}
                    groupId={groupData.id}
                    revalidateData={mutate}
                  />
                )}
                {userCanDemote && member.admin && (
                  <DemoteModal
                    member={member}
                    groupId={groupData.id}
                    revalidateData={mutate}
                  />
                )}
                {userCanRemove && (
                  <RemoveModal
                    member={member}
                    groupId={groupData.id}
                    revalidateData={mutate}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function MembersTable(props: MembersTableProps) {
  return (
    <SWRProvider>
      <_MembersTables {...props} />
    </SWRProvider>
  );
}
