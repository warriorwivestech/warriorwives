"use client";

import { Event } from "@/app/api/groups/[groupId]/events/types";
import { SWRProvider } from "@/app/providers/swrProvider";
import useSWR from "swr";
import EventCards from "../EventCards";

interface OtherEventsProps {
  groupId: number;
  eventId: number;
}

function _OtherEvents({ groupId, eventId }: OtherEventsProps) {
  const {
    data: otherEvents,
    error,
    isLoading,
  } = useSWR<Event[]>(`/groups/${groupId}/${eventId}`);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;
  if (!otherEvents || otherEvents.length === 0)
    return <div>No other events</div>;

  return (
    <div className="flex flex-row gap-4 overflow-x-scroll">
      {otherEvents.map((event) => {
        return (
          <EventCards
            key={event.id}
            id={event.id}
            name={event.name}
            description={event.description}
            displayPhoto={event.displayPhoto}
            online={event.online}
            meetingLink={event.meetingLink}
            location={event.location}
            dateTime={event.dateTime}
            attendeesCount={event._count.attendees}
            groupId={event.groupId}
            longCard={true}
          />
        );
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
