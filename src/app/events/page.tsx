import { Flex } from "@chakra-ui/react";
import React from "react";
import EventCards from "../components/EventCards";
import { apiClient } from "../apiClient";
import { Event } from "../api/groups/[groupId]/events/types";

export default async function EventsPage() {
  const events: Event[] = await apiClient("/users/3/events", {
    cache: "no-store",
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <p className="text-heading4">Joined events</p>
        {events.length === 0 ? (
          <p>No events joined yet</p>
        ) : (
          <Flex className="flex-col w-[100%]" gap={6}>
            {events.map((event) => (
              <EventCards
                key={event.id}
                id={event.id}
                groupId={event.groupId}
                name={event.name}
                description={event.description}
                displayPhoto={event.displayPhoto}
                online={event.online}
                meetingLink={event.meetingLink}
                location={event.location}
                dateTime={event.dateTime}
                attendeesCount={event._count.attendees}
              />
            ))}
          </Flex>
        )}
      </div>
    </>
  );
}
