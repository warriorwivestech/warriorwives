import { Flex } from "@chakra-ui/react";
import React from "react";
import EventCard from "../../components/EventCard";
import { JoinedEvents, getJoinedEvents } from "../../data/joinedEvents";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploreEvents from "./components/ExploreEvents";

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

export default async function EventsPage() {
  const { data: events, error } = await getJoinedEvents();

  const EventsData = () => {
    if (error)
      return (
        <div className="mt-4 text-gray-600 text-sm">Error loading events</div>
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
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <TypographyH3>My Events</TypographyH3>
        <EventsData />
      </div>
    </>
  );
}
