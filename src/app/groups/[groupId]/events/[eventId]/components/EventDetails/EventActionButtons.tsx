import { UserDataType } from "@/app/api/user/route";
import { SWRResponse } from "swr";
import { SingleEventDataType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import JoinEventButton from "./JoinEventButton";
import LeaveEventButton from "./LeaveEventButton";
import EditEventModal from "@/components/EventModal/EditEvent";
import DeleteEventButton from "./DeleteEventButton";

interface EventActionButtonsProps {
  event: SingleEventDataType;
  user: SWRResponse<UserDataType, any, any>;
}

export default function EventActionButtons({
  event,
  user,
}: EventActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, joined, userIsAdmin, groupId } = event;
  const userIsSuperUser = userData?.superUser;

  function JoinOrLeaveButton() {
    if (joined) {
      return (
        <LeaveEventButton
          groupId={groupId}
          eventId={id}
          joined={joined}
          disabled={isLoading}
        />
      );
    } else {
      return (
        <JoinEventButton
          groupId={groupId}
          eventId={id}
          joined={joined}
          disabled={isLoading}
        />
      );
    }
  }

  if (userIsAdmin || userIsSuperUser) {
    return (
      <div className="flex flex-col gap-2">
        <EditEventModal
          groupName={event.groupName}
          groupId={groupId}
          event={event}
        />
        {/* for organizers, if they have joined already, don't allow them to leave the event */}
        {/* any admin of the group who joins the event is an organizer */}
        {userIsAdmin && (
          <JoinEventButton
            groupId={groupId}
            eventId={id}
            joined={joined}
            disabled={isLoading}
          />
        )}
        {/* super user can join or leave */}
        {!userIsAdmin && <JoinOrLeaveButton />}
        <DeleteEventButton
          groupId={groupId}
          eventId={id}
          disabled={isLoading}
        />
      </div>
    );
  }

  return <JoinOrLeaveButton />;
}
