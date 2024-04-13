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
import { LeaveEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/leave/route";

interface LeaveEventModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: TriggerWithoutArgs<
    LeaveEventResponseType,
    any,
    `/groups/${number}/events/${number}/leave`,
    never
  >;
  disabled: boolean;
  data: LeaveEventResponseType | undefined;
}

export default function LeaveEventModal({
  open,
  onOpenChange,
  trigger,
  disabled,
  data,
}: LeaveEventModalProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    if (data.error) {
      toast({
        variant: "destructive",
        title: "Unable to leave event.",
        description: data.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} variant="destructive">
          Leave
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Event?</AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer be a part of this event and will be removed from
            the list of attendees.
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
            variant="destructive"
          >
            {disabled ? <Spinner size="sm" /> : "Leave"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
