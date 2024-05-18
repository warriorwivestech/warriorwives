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

interface PromoteModalProps {
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

export default function PromoteModal({
  member,
  groupId,
  revalidateData,
}: PromoteModalProps) {
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
          title: `Member Promoted`,
          description: `${memberName} has been successfully promoted to group admin!`,
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
        <Button variant="outline" className="mr-2 w-24" disabled={disabled}>
          {disabled ? "Promoting..." : "Promote"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will grant all admin privileges to {memberName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger({ action: "promote" });
            }}
            disabled={disabled}
          >
            Promote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
