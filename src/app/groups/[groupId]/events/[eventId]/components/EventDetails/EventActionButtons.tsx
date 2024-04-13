import { UserDataType } from "@/app/api/user/route";
import { SWRResponse } from "swr";
import { SingleEventDataType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import { EditEvent } from "@/components/EventModal/EditEvent";
import JoinEventButton from "./JoinEventButton";

interface EventActionButtonsProps {
  event: SingleEventDataType;
  user: SWRResponse<UserDataType, any, any>;
}

export default function EventActionButtons({
  event,
  user,
}: EventActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, joined, userIsAdmin, groupId, userIsOrganizer } = event;

  if (userIsAdmin || userData?.superUser) {
    return (
      <div className="flex flex-col gap-2">
        <EditEvent groupName={event.groupName} groupId={groupId} />
        <JoinEventButton
          groupId={groupId}
          eventId={id}
          joined={joined}
          disabled={isLoading}
        />
      </div>
    );
  }

  return (
    <JoinEventButton
      groupId={groupId}
      eventId={id}
      joined={joined}
      disabled={isLoading}
    />
  );
}
