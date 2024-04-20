import { Flex, Skeleton } from "@chakra-ui/react";
import EventCard from "@/components/EventCard";
import { SWRResponse } from "swr";
import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";

export default function GroupEventsData({
  events,
}: {
  events: SWRResponse<GroupEvents, any, any>;
}) {
  const { data: eventsData, error, isLoading } = events;

  if (isLoading)
    return (
      <div className="w-full md:w-[65%] flex flex-col gap-8">
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
        Join this group to view events!
      </div>
    );
  }

  if (!eventsData || eventsData.length === 0)
    return (
      <div className="text-sm text-gray-600">
        No events found for this group.
      </div>
    );

  return (
    <Flex className="flex-col w-full md:w-[65%]" gap={6}>
      {/* only upcoming events */}
      {eventsData
        .filter((event) => new Date(event.startDateTime) > new Date())
        .map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
    </Flex>
  );
}
