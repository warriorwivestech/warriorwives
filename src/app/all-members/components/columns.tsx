"use client";

import BranchBadge, {
  BranchType,
} from "@/app/all-groups/components/BranchBadge";
import { AllUsersDataType } from "@/app/api/users/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
    header: "Super User",
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

      if (verificationStatus === "sheerIdVerified") {
        return (
          <Badge variant="default" className="bg-orange-500">
            Awaiting Manual Verication
          </Badge>
        );
      }

      if (verificationStatus === "manualVerified") {
        return (
          <Badge variant="default" className="bg-orange-500">
            Awaiting SheerID Verification
          </Badge>
        );
      }

      return <Badge variant="secondary">Unverified</Badge>;
    },
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              href={`members/${member.id}`}
              target="blank"
              rel="noopener noreferrer"
            >
              <DropdownMenuItem className="cursor-pointer">
                View member
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
