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
import { JoinEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/join/route";
import { useToast } from "@/components/ui/use-toast";

interface JoinEventModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: TriggerWithoutArgs<
    JoinEventResponseType,
    any,
    `/groups/${number}/events/${number}/join`,
    never
  >;
  disabled: boolean;
  data: JoinEventResponseType | undefined;
}

export default function JoinEventModal({
  open,
  onOpenChange,
  trigger,
  disabled,
  data,
}: JoinEventModalProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    if (data.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: data.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled}>Join Event</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Join Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you join this event, an email with a calendar invite will be
            sent to you.
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
            {disabled ? <Spinner size="sm" /> : "Join"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
