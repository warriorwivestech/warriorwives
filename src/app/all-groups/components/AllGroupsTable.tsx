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
import { AllGroupsDataType } from "@/data/allGroups";
import Link from "next/link";

interface AllGroupsTableProps {
  groups: AllGroupsDataType | undefined;
  error: any;
}

export default function AllGroupsTable({ groups, error }: AllGroupsTableProps) {
  if (error) return <div>Error loading groups</div>;
  if (!groups || groups.length === 0) return <div>No groups found.</div>;

  const sortedGroups = groups.sort((a, b) => a.id - b.id);

  return (
    <Table>
      <TableCaption>All created groups.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Branch of Service</TableHead>
          <TableHead>County</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Online?</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Password Enabled?</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          return (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.archived ? "Archived" : "Active"}</TableCell>
              <TableCell>{group.branchOfService}</TableCell>
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
