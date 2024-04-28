import { UserDataType } from "@/app/api/user/route";
import { SWRResponse } from "swr";
import { SingleEventDataType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import JoinEventButton from "./JoinEventButton";
import LeaveEventButton from "./LeaveEventButton";
import EditEventModal from "@/components/EventModal/EditEvent";
import DeleteEventButton from "./DeleteEventButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import NotifyMembersButton from "./NotifyMembersButton";

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
        <div className="flex gap-2">
          <EditEventModal
            groupName={event.groupName}
            groupId={groupId}
            event={event}
          />
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  // class="lucide lucide-ellipsis-vertical"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col gap-2">
              <NotifyMembersButton
                groupId={groupId}
                eventId={id}
                sendEmailStatus={event.sendEmailStatus}
                disabled={isLoading}
              />
              <DeleteEventButton
                groupId={groupId}
                eventId={id}
                disabled={isLoading}
              />
            </PopoverContent>
          </Popover>
        </div>
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
      </div>
    );
  }

  return <JoinOrLeaveButton />;
}
