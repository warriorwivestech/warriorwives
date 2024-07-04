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

interface ArchiveGroupModalProps {
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

export default function ArchiveGroupModal({
  group,
  revalidateData,
}: ArchiveGroupModalProps) {
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
          title: `Troop Archived`,
          description: `${groupName} troop has been successfully archived.`,
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
          className="mr-2 w-20"
          disabled={disabled}
          size="sm"
        >
          {disabled ? "Archiving" : "Archive"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive {groupName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive the {groupName} troop and members will no longer
            be able to access it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger({ action: "archive" });
            }}
            disabled={disabled}
            variant="destructive"
          >
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
