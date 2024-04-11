import { Flex } from "@chakra-ui/react";
import React from "react";
import EventCard from "../../components/EventCard";
import { getJoinedEvents } from "../../data/joinedEvents";
import { TypographyH3 } from "@/components/ui/typography/h3";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/ui/typography/muted";

export default async function EventsPage() {
  const { data: events, error } = await getJoinedEvents();

  const ExploreEvents = () => {
    return (
      <div>
        <TypographyMuted>
          No events joined. Explore events from your groups.
        </TypographyMuted>
        <Link href="/groups">
          <Button className="mt-4">View Groups</Button>
        </Link>
      </div>
    );
  };

  const EventsData = () => {
    if (error) return <div>Error loading events</div>;
    if (!events || events.length === 0) return <ExploreEvents />;

    return (
      <Flex className="flex-col w-[100%]" gap={6}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Flex>
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
