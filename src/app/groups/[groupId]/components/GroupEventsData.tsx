import { Flex, Skeleton } from "@chakra-ui/react";
import EventCard from "@/components/EventCard";
import { SWRResponse } from "swr";
import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GroupEventsData({
  events,
}: {
  events: SWRResponse<GroupEvents, any, any>;
}) {
  const { data: eventsData, error, isLoading } = events;

  if (isLoading)
    return (
      <div className="w-full lg:w-[65%] flex flex-col gap-8">
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
      </div>
    );
  if (error)
    return <div className="text-sm text-gray-600">Error loading events</div>;

  // @ts-ignore
  if (eventsData && eventsData.error) {
    return (
      <div className="text-sm text-gray-600">
        Join this troop to view events!
      </div>
    );
  }

  const upcomingEvents = eventsData?.filter(
    (event) => new Date(event.startDateTime) > new Date()
  );
  const pastEvents = eventsData
    ?.filter((event) => new Date(event.startDateTime) < new Date())
    .reverse();

  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <Flex className="flex-col w-full lg:w-[65%]" gap={4}>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-sm text-gray-600 mt-2">
              No upcoming events found for this troop.
            </div>
          )}
        </Flex>
      </TabsContent>
      <TabsContent value="past">
        <Flex className="flex-col w-full lg:w-[65%]" gap={4}>
          {pastEvents && pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-sm text-gray-600 mt-2">
              No past events found for this troop.
            </div>
          )}
        </Flex>
      </TabsContent>
    </Tabs>
  );
}
