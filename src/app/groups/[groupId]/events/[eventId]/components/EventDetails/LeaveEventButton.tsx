import { apiClient } from "@/apiClient";
import { LeaveEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/leave/route";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import LeaveEventModal from "./LeaveEventModal";

async function leaveEvent(url: string): Promise<LeaveEventResponseType> {
  const response = await apiClient(url, {
    method: "DELETE",
  });
  return response;
}

interface LeaveEventButtonProps {
  groupId: number;
  eventId: number;
  joined: boolean;
  disabled: boolean;
}

export default function LeaveEventButton({
  groupId,
  eventId,
  joined,
  disabled,
}: LeaveEventButtonProps) {
  const [justLeft, setJustLeft] = useState(false);
  const [joinEventModalOpen, setLeaveEventModalOpen] = useState(false);
  const { toast } = useToast();

  const { data, error, trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/events/${eventId}/leave`,
    leaveEvent,
    {
      onSuccess(data) {
        if (data?.data) {
          setJustLeft(true);
          setLeaveEventModalOpen(false);
          toast({
            title: `Removed From Event`,
            description: `You have successfully left this event.`,
          });
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      },
    }
  );

  if (!joined || justLeft) {
    return (
      <Button variant="secondary" className="w-full" disabled={true}>
        Left Event
      </Button>
    );
  }

  return (
    <LeaveEventModal
      open={joinEventModalOpen}
      onOpenChange={setLeaveEventModalOpen}
      trigger={trigger}
      disabled={isMutating || disabled}
      data={data}
    />
  );
}
