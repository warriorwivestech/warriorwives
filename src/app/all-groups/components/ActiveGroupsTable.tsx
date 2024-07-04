import { AllGroupsDataType } from "@/app/api/groups/all/route";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import ArchiveGroupModal from "./ArchiveGroupModal";
import { KeyedMutator, mutate } from "swr";
import BranchBadge, { BranchType } from "./BranchBadge";

interface ActiveGroupsTableProps {
  groups: AllGroupsDataType;
  revalidateData: KeyedMutator<AllGroupsDataType>;
}

export default function ActiveGroupsTable({ groups }: ActiveGroupsTableProps) {
  const sortedGroups = groups
    .sort((a, b) => a.id - b.id)
    .filter((group) => !group.archived);

  return (
    <Table>
      <TableCaption>All active troops.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="min-w-[120px]">Name</TableHead>
          <TableHead>Branch of Service</TableHead>
          <TableHead>County</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Online?</TableHead>
          <TableHead>Password Enabled?</TableHead>
          <TableHead className="min-w-[190px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          return (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>
                <BranchBadge branch={group.branchOfService as BranchType} />
              </TableCell>
              <TableCell>{group.county}</TableCell>
              <TableCell>{group.state}</TableCell>
              <TableCell>{group.online ? "✅" : "❌"}</TableCell>
              <TableCell>{group.passwordEnabled ? "✅" : "❌"}</TableCell>
              <TableCell>
                <Link href={`/groups/${group.id}`} className="mr-2">
                  <Button size="sm">View</Button>
                </Link>
                <ArchiveGroupModal group={group} revalidateData={mutate} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
