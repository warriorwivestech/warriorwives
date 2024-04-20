"use client";

import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import EventCard from "../../../../../../../components/EventCard";
import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";

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

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div className="text-gray-600 text-sm">Error loading events</div>;
  // @ts-ignore
  if (otherEvents && otherEvents.error) {
    return (
      <div className="text-sm text-gray-600">
        Join this group to view events!
      </div>
    );
  }
  if (!otherEvents || otherEvents.length === 0)
    return <div className="text-gray-600 text-sm">No other events</div>;

  return (
    <div className="flex flex-row gap-4 overflow-x-scroll pb-2 pl-1">
      {otherEvents.map((event) => {
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
