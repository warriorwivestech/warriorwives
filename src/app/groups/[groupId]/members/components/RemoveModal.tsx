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

interface RemoveModalProps {
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

async function removeMember(url: string) {
  await apiClient(url, {
    method: "DELETE",
  });
}

export default function RemoveModal({
  member,
  groupId,
  revalidateData,
}: RemoveModalProps) {
  const { toast } = useToast();
  const memberName = member.name as string;

  const [isRevalidating, setIsRevalidating] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/members/${member.id}`,
    removeMember,
    {
      onSuccess: () => {
        revalidateData();
        toast({
          title: `Member Removed`,
          description: `${memberName} has been removed from the group.`,
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
          variant="destructive"
          className="mr-2 w-24"
          disabled={disabled}
          size="sm"
        >
          {disabled ? "Removing..." : "Remove"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action will remove ${memberName} from the group. They will be permanently removed until they re-join the group.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger();
            }}
            disabled={disabled}
            variant="destructive"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
