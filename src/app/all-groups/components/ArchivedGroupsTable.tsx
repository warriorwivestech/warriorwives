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

interface ArchivedGroupsTableProps {
  groups: AllGroupsDataType | undefined;
  error: any;
}

export default function ArchivedGroupsTable({
  groups,
  error,
}: ArchivedGroupsTableProps) {
  if (error) return <div>Error loading groups</div>;
  if (!groups || groups.length === 0) return <div>No groups found.</div>;

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
          <TableHead>Action</TableHead>
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
          const parsedArchivedAt = archivedAt
            ? new Date(archivedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "N/A";

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{branchOfService}</TableCell>
              <TableCell>{county}</TableCell>
              <TableCell>{state}</TableCell>
              <TableCell>{online ? "✅" : "❌"}</TableCell>
              <TableCell>{passwordEnabled ? "✅" : "❌"}</TableCell>
              <TableCell>{parsedArchivedAt}</TableCell>
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
