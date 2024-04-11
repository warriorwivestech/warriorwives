"use client";

import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import EventCard from "../EventCard";
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
  } = useSWR<GroupEvents>([`/groups/${groupId}/events/${eventId}`]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;
  if (!otherEvents || otherEvents.length === 0)
    return <div>No other events</div>;

  return (
    <div className="flex flex-row gap-4 overflow-x-scroll">
      {otherEvents.map((event) => {
        return <EventCard key={event.id} longCard={true} {...event} />;
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
