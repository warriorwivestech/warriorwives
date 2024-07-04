"use client";

import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import EventCard from "../../../../../../../components/EventCard";
import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";
import OtherEventsLoading from "./OtherEventsLoading";

interface OtherEventsProps {
  groupId: number;
  eventId: number;
}

function _OtherEvents({ groupId, eventId }: OtherEventsProps) {
  const {
    data: otherEvents,
    error,
    isLoading,
  } = useSWR<GroupEvents>([`/groups/${groupId}/events?exclude=${eventId}`]);

  if (isLoading) return <OtherEventsLoading />;
  if (error)
    return <div className="text-gray-600 text-sm">Error loading events</div>;
  // @ts-ignore
  if (otherEvents && otherEvents.error) {
    return (
      <div className="text-sm text-gray-600">
        Join this troop to view events!
      </div>
    );
  }
  const upcomingEvents = otherEvents?.filter(
    (event) => new Date(event.startDateTime) > new Date()
  );

  if (!upcomingEvents || upcomingEvents.length === 0)
    return (
      <div className="text-gray-600 text-sm">
        No other upcoming events from this troop
      </div>
    );

  return (
    <div className="flex flex-row gap-4 overflow-x-scroll pb-2 pl-1">
      {upcomingEvents.map((event) => {
        return <EventCard key={event.id} shortCard event={event} />;
      })}
    </div>
  );
}

export default function OtherEvents({ groupId, eventId }: OtherEventsProps) {
  return (
    <SWRProvider>
      <_OtherEvents groupId={groupId} eventId={eventId} />
    </SWRProvider>
  );
}
