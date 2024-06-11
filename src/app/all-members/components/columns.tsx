"use client";

import BranchBadge, {
  BranchType,
} from "@/app/all-groups/components/BranchBadge";
import { AllUsersDataType } from "@/app/api/users/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import ActionsMenu from "./ActionsMenu";

export const columns: ColumnDef<AllUsersDataType[0]>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
  },
  {
    accessorKey: "superUser",
    header: "Super Admin",
    cell: ({ row }) => {
      const superUser = row.getValue("superUser");

      return (
        <Badge variant={superUser ? "default" : "secondary"}>
          {superUser ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    cell: ({ row }) => {
      const branch = row.getValue("branch");

      return <BranchBadge branch={branch as BranchType} />;
    },
  },
  {
    accessorKey: "verificationStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Verification Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const verificationStatus = row.getValue("verificationStatus");

      if (verificationStatus === "verified") {
        return (
          <Badge variant="default" className="bg-green-500">
            Verified
          </Badge>
        );
      }

      if (verificationStatus === "manualVerificationRemoved") {
        return (
          <Badge variant="default" className="bg-red-500">
            Access Revoked
          </Badge>
        );
      }

      if (verificationStatus === "pendingSheerIdVerification") {
        return (
          <Badge variant="default" className="bg-orange-500">
            Pending SheerID Verification
          </Badge>
        );
      }

      return <Badge variant="secondary">Unverified</Badge>;
    },
  },
  {
    accessorKey: "sheerIdVerificationId",
    header: "SheerID Verification ID",
  },
  {
    accessorKey: "sheerIdVerified",
    header: "SheerID Verified",
    cell: ({ row }) => {
      const sheerIdVerified = row.getValue("sheerIdVerified");

      return (
        <Badge variant={sheerIdVerified ? "default" : "secondary"}>
          {sheerIdVerified ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "manualVerified",
    header: "Manual Verified",
    cell: ({ row }) => {
      const manualVerified = row.getValue("manualVerified");

      return (
        <Badge variant={manualVerified ? "default" : "secondary"}>
          {manualVerified ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const member = row.original;
      const { id, superUser, manualVerified } = member;

      return (
        <ActionsMenu
          id={id}
          superUser={superUser}
          manualVerified={manualVerified}
          name={member.name as string}
        />
      );
    },
  },
];
