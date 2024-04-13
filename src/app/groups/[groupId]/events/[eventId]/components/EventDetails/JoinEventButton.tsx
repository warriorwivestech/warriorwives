import { apiClient } from "@/apiClient";
import { JoinEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/join/route";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import JoinEventModal from "./JoinEventModal";

async function joinEvent(url: string): Promise<JoinEventResponseType> {
  const response = await apiClient(url, {
    method: "POST",
  });
  return response;
}

interface JoinEventButtonProps {
  groupId: number;
  eventId: number;
  joined: boolean;
  disabled: boolean;
}

export default function JoinEventButton({
  groupId,
  eventId,
  joined,
  disabled,
}: JoinEventButtonProps) {
  const [justJoined, setJustJoined] = useState(false);
  const [joinEventModalOpen, setJoinEventModalOpen] = useState(false);
  const { toast } = useToast();

  const { data, error, trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/events/${eventId}/join`,
    joinEvent,
    {
      onSuccess(data) {
        if (data?.data) {
          setJustJoined(true);
          setJoinEventModalOpen(false);
          toast({
            title: `Joined Event`,
            description: `You have successfully joined this event.`,
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

  if (joined || justJoined) {
    return (
      <Button variant="secondary" className="w-full" disabled={true}>
        Joined
      </Button>
    );
  }

  return (
    <JoinEventModal
      open={joinEventModalOpen}
      onOpenChange={setJoinEventModalOpen}
      trigger={trigger}
      disabled={isMutating || disabled}
      data={data}
    />
  );
}
