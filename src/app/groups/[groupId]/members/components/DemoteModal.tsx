"use client";

import { apiClient } from "@/apiClient";
import { GroupMembers } from "@/app/api/groups/[groupId]/members/route";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";

interface DemoteModalProps {
  member: {
    branch: string;
    admin: boolean;
    id: number;
    email: string | null;
    name: string | null;
    superUser: boolean;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  groupId: number;
  revalidateData: KeyedMutator<GroupMembers>;
}

async function updateRole(
  url: string,
  { arg }: { arg: { action: "promote" | "demote" } }
) {
  await apiClient(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

export default function DemoteModal({
  member,
  groupId,
  revalidateData,
}: DemoteModalProps) {
  const { toast } = useToast();
  const memberName = member.name as string;

  const [isRevalidating, setIsRevalidating] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/members/${member.id}`,
    updateRole,
    {
      onSuccess: () => {
        revalidateData();
        toast({
          title: `Member Demoted`,
          description: `${memberName} has been successfully demoted.`,
        });
      },
      onError: (error) => {
        setIsRevalidating(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      },
    }
  );
  const disabled = isMutating || isRevalidating;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="mr-2 w-24"
          disabled={disabled}
          size="sm"
        >
          {disabled ? "Demoting..." : "Demote"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Demote {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all admin privileges from {memberName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger({ action: "demote" });
            }}
            disabled={disabled}
          >
            Demote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
