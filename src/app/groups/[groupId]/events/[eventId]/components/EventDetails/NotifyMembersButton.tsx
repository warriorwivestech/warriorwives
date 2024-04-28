import { apiClient } from "@/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/button";
import { sendEmailStatus } from "@prisma/client";
import NotifyMembersModal from "./NotifyMembersModal";
import { NotifyMembersResponseType } from "@/app/api/groups/[groupId]/events/[eventId]/notify/route";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function notifyMembers(url: string): Promise<NotifyMembersResponseType> {
  const response = await apiClient(url, {
    method: "PUT",
  });
  return response;
}

function tooltipDescription(
  sendEmailStatus: sendEmailStatus,
  justNotified: boolean
) {
  if (justNotified) {
    return "Notifications are being sent to members.";
  }

  switch (sendEmailStatus) {
    case "QUEUED":
      return "Notifications are being sent to members.";
    case "IN_PROGRESS":
      return "Notifications are being sent to members.";
    case "SENT":
      return "Notifications have been sent to members. You can only notify members once.";
    case "NOT_QUEUED":
      return "Members have not been notified.";
    default:
      return "Members have not been notified.";
  }
}

interface NotifyMembersButtonProps {
  groupId: number;
  eventId: number;
  sendEmailStatus: sendEmailStatus;
  disabled: boolean;
}

export default function NotifyMembersButton({
  groupId,
  eventId,
  sendEmailStatus,
  disabled,
}: NotifyMembersButtonProps) {
  const [justNotified, setJustNotified] = useState(false);
  const [notifyMembersModalOpen, setNotifyMembersModalOpen] = useState(false);
  const { toast } = useToast();

  const sendNotificationAllowed = sendEmailStatus === "NOT_QUEUED";

  const { data, error, trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/events/${eventId}/notify`,
    notifyMembers,
    {
      onSuccess(data) {
        if (data?.data) {
          setJustNotified(true);
          setNotifyMembersModalOpen(false);
          toast({
            title: `Notifications Queued`,
            description: `All members of this group will be notified of this event soon.`,
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

  if (!sendNotificationAllowed || justNotified) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="secondary" className="w-full" disabled={true}>
              Members Notified
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 whitespace-pre-wrap max-w-56">
            {tooltipDescription(sendEmailStatus, justNotified)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NotifyMembersModal
      open={notifyMembersModalOpen}
      onOpenChange={setNotifyMembersModalOpen}
      trigger={trigger}
      disabled={isMutating || disabled}
      data={data}
    />
  );
}
