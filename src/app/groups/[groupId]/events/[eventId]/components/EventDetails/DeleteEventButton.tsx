import { apiClient } from "@/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import DeleteEventModal from "./DeleteEventModal";
import { DeleteEventResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import { useRouter } from "next/navigation";

async function deleteEvent(url: string): Promise<DeleteEventResponseType> {
  const response = await apiClient(url, {
    method: "DELETE",
  });
  return response;
}

interface DeleteEventButtonProps {
  groupId: number;
  eventId: number;
  disabled: boolean;
}

export default function DeleteEventButton({
  groupId,
  eventId,
  disabled,
}: DeleteEventButtonProps) {
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { data, error, trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/events/${eventId}`,
    deleteEvent,
    {
      onSuccess(data) {
        if (data?.data) {
          setDeleteEventModalOpen(false);
          toast({
            title: `Event Deleted`,
            description: `You have successfully deleted this event.`,
          });
          router.replace(`/groups/${groupId}`);
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

  return (
    <DeleteEventModal
      open={deleteEventModalOpen}
      onOpenChange={setDeleteEventModalOpen}
      trigger={trigger}
      disabled={isMutating || disabled}
      data={data}
    />
  );
}
