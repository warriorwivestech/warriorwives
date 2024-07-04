"use client";

import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { AllUsersDataType } from "@/app/api/users/route";

function _MembersTable() {
  const { data, error, isLoading, mutate } = useSWR<AllUsersDataType>([
    `/users`,
  ]);

  if (isLoading)
    return (
      <>
        <Skeleton className="h-8 w-1/4 mb-4 mt-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
      </>
    );
  if (error)
    return (
      <div className="mt-4 text-gray-600 text-sm">Error loading members</div>
    );

  const members = data || [];

  const headers = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "superUser", label: "Super Admin" },
    { key: "branch", label: "Branch of Service" },
    { key: "verificationStatus", label: "Verification Status" },
    { key: "sheerIdVerificationId", label: "SheerID Verification ID" },
    { key: "sheerIdVerified", label: "SheerID Verified" },
    { key: "manualVerified", label: "Manual Verified" },
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "twitter", label: "Twitter" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "interestsCount", label: "Interests Count" },
    { key: "groupsCount", label: "Troops Joined" },
    { key: "eventsJoinedCount", label: "Events Joined" },
    { key: "eventsOrganizedCount", label: "Events Organized" },
  ];

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={members}
        exportData={members}
        exportHeaders={headers}
      />
    </div>
  );
}

export default function MembersTable() {
  return (
    <SWRProvider>
      <_MembersTable />
    </SWRProvider>
  );
}
