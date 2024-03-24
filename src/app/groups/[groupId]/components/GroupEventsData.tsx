import { Flex, Skeleton } from "@chakra-ui/react";
import EventCard from "@/app/components/EventCard";
import { SWRResponse } from "swr";
import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";

export default function GroupEventsData({
  events
}: {
  events: SWRResponse<GroupEvents, any, any>;
}) {
  const { data: eventsData, error, isLoading } = events;

  if (isLoading)
    return (
      <div className="w-[100%] md:w-[65%] flex flex-col gap-8">
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
      </div>
    );
  if (error) return <div>Error loading events</div>;
  if (!eventsData || eventsData.length === 0) return <div>No events found for this group.</div>;

  return (
    <Flex className='flex-col w-[100%] md:w-[65%]' gap={6}>
      {eventsData.map((event) => (
        <EventCard
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
  );
}