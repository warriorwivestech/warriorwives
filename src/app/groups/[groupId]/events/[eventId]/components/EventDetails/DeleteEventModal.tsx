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
import { DeleteEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/route";

interface DeleteEventModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: TriggerWithoutArgs<
    DeleteEventResponseType,
    any,
    `/groups/${number}/events/${number}`,
    never
  >;
  disabled: boolean;
  data: DeleteEventResponseType | undefined;
}

export default function DeleteEventModal({
  open,
  onOpenChange,
  trigger,
  disabled,
  data,
}: DeleteEventModalProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    if (data.error) {
      toast({
        variant: "destructive",
        title: "Unable to delete event.",
        description: data.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} variant="destructive">
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this event? This action cannot be
            undone. Attendees will receive a notification that the event has
            been canceled.
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
            {disabled ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
