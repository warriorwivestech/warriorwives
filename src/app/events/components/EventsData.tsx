"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JoinedEvents } from "@/data/joinedEvents";
import ExploreEvents from "./ExploreEvents";
import { Flex } from "@chakra-ui/react";
import EventCard from "@/components/EventCard";

function EventsList({ events }: { events: JoinedEvents }) {
  if (!events || events.length === 0) return <ExploreEvents />;

  return (
    <Flex className="flex-col w-[100%]" gap={6}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Flex>
  );
}

export default function EventsData({
  events,
  error,
}: {
  events: JoinedEvents | undefined;
  error:
    | {
        message: any;
      }
    | undefined;
}) {
  if (error)
    return (
      <div className="mt-4 text-gray-600 text-sm">
        Error loading events, please reload the page and try again.
      </div>
    );

  const upcomingEvents = events
    ? events.filter((event) => new Date(event.startDateTime) > new Date())
    : [];
  const pastEvents = events
    ? events
        .filter((event) => new Date(event.startDateTime) < new Date())
        .reverse()
    : [];

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <EventsList events={upcomingEvents} />
      </TabsContent>
      <TabsContent value="past">
        <EventsList events={pastEvents} />
      </TabsContent>
    </Tabs>
  );
}
