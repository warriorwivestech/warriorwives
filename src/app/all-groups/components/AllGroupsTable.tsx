import { AllGroupsDataType } from "@/app/api/groups/all/route";
import { Badge } from "@/components/ui/badge";
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
import BranchBadge, { BranchType } from "./BranchBadge";

interface AllGroupsTableProps {
  groups: AllGroupsDataType;
}

export default function AllGroupsTable({ groups }: AllGroupsTableProps) {
  const sortedGroups = groups.sort((a, b) => a.id - b.id);

  return (
    <Table>
      <TableCaption>All created groups.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="min-w-[120px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Branch of Service</TableHead>
          <TableHead>County</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Online?</TableHead>
          <TableHead>Password Protected?</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          const archived = group.archived;
          const badgeVariant = archived ? "destructive" : "default";

          return (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>
                <Badge variant={badgeVariant}>
                  {archived ? "Archived" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <BranchBadge branch={group.branchOfService as BranchType} />
              </TableCell>
              <TableCell>{group.county}</TableCell>
              <TableCell>{group.state}</TableCell>
              <TableCell>{group.online ? "✅" : "❌"}</TableCell>
              <TableCell>{group.passwordEnabled ? "✅" : "❌"}</TableCell>
              <TableCell>
                <Link href={`/groups/${group.id}`}>
                  <Button>View</Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
