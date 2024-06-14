"use client";

import { apiClient } from "@/apiClient";
import { AllGroupsDataType } from "@/app/api/groups/all/route";
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

interface ActivateGroupModalProps {
  group: AllGroupsDataType[0];
  revalidateData: KeyedMutator<AllGroupsDataType>;
}

async function updateRole(
  url: string,
  { arg }: { arg: { action: "activate" | "archive" } }
) {
  await apiClient(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

export default function ActivateGroupModal({
  group,
  revalidateData,
}: ActivateGroupModalProps) {
  const { toast } = useToast();
  const groupName = group.name;

  const [isRevalidating, setIsRevalidating] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    `/groups/${group.id}/status`,
    updateRole,
    {
      onSuccess: () => {
        revalidateData();
        toast({
          title: `Group Activated`,
          description: `${groupName} group has been successfully activated.`,
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
          variant="outline"
          className="mr-2 w-20"
          disabled={disabled}
          size="sm"
        >
          {disabled ? "Activating" : "Activate"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate {groupName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will activate the {groupName} group and existing members will
            be able to access the group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger({ action: "activate" });
            }}
            disabled={disabled}
          >
            Activate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
