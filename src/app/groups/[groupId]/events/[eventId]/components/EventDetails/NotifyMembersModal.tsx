"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TriggerWithoutArgs } from "swr/mutation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@/components/ui/use-toast";
import { NotifyMembersResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/notify/route";

interface NotifyMembersModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: TriggerWithoutArgs<
    NotifyMembersResponseType,
    any,
    `/groups/${number}/events/${number}/notify`,
    never
  >;
  disabled: boolean;
  data: NotifyMembersResponseType | undefined;
}

export default function NotifyMembersModal({
  open,
  onOpenChange,
  trigger,
  disabled,
  data,
}: NotifyMembersModalProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    if (data.error) {
      toast({
        variant: "destructive",
        title: "Failed to notify members.",
        description: data.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} className="w-full">
          Notify Members
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Notify Members</AlertDialogTitle>
          <AlertDialogDescription>
            An email will be sent to all members of this troop to notify them of
            this event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={disabled}
            className="w-20"
            onClick={() => {
              trigger();
            }}
          >
            {disabled ? <Spinner size="sm" /> : "Notify"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
