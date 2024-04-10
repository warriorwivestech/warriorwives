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
import { parseDate } from "@/helpers/dateParser";
import Link from "next/link";
import ActivateGroupModal from "./ActivateGroupModal";
import { KeyedMutator } from "swr";
import BranchBadge, { BranchType } from "./BranchBadge";

interface ArchivedGroupsTableProps {
  groups: AllGroupsDataType;
  revalidateData: KeyedMutator<AllGroupsDataType>;
}

export default function ArchivedGroupsTable({
  groups,
  revalidateData,
}: ArchivedGroupsTableProps) {
  const sortedGroups = groups
    .sort((a, b) => a.id - b.id)
    .filter((group) => group.archived);

  return (
    <Table>
      <TableCaption>All archived groups.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Branch of Service</TableHead>
          <TableHead>County</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Online?</TableHead>
          <TableHead>Password Enabled?</TableHead>
          <TableHead>Archived At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          const {
            id,
            name,
            branchOfService,
            county,
            state,
            online,
            passwordEnabled,
            archivedAt,
          } = group;
          const parsedArchivedAt = archivedAt ? parseDate(archivedAt) : "N/A";

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>
                <BranchBadge branch={branchOfService as BranchType} />
              </TableCell>
              <TableCell>{county}</TableCell>
              <TableCell>{state}</TableCell>
              <TableCell>{online ? "✅" : "❌"}</TableCell>
              <TableCell>{passwordEnabled ? "✅" : "❌"}</TableCell>
              <TableCell>{parsedArchivedAt}</TableCell>
              <TableCell>
                <Link href={`/groups/${group.id}`} className="mr-2">
                  <Button>View</Button>
                </Link>
                <ActivateGroupModal
                  group={group}
                  revalidateData={revalidateData}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
