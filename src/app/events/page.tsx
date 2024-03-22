import { Flex } from "@chakra-ui/react";
import React from "react";
import EventCard from "../components/EventCard";
import { getJoinedEvents } from "../data/joinedEvents";

export default async function EventsPage() {
  // TODO: update this to use the user's actual id
  const { data: events, error } = await getJoinedEvents(3);

  const EventsData = () => {
    if (error) return <div>Error loading events</div>;
    if (!events || events.length === 0)
      return <div>You have not joined any events yet.</div>;

    return (
      <Flex className="flex-col w-[100%]" gap={6}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            {...event}
          />
        ))}
      </Flex>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <p className="text-heading4">Joined events</p>
        <EventsData />
      </div>
    </>
  );
}
