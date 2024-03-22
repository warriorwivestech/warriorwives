import { Flex, Skeleton } from "@chakra-ui/react";
import { Event } from "@/app/api/groups/[groupId]/events/types";
import EventCards from "@/app/components/EventCards";

export default function GroupEventsData({
  eventsData,
  isLoading,
  error,
}: {
  eventsData: Event[];
  isLoading: boolean;
  error: any;
}) {
  if (isLoading)
    return (
      <div className="w-[100%] md:w-[65%] flex flex-col gap-8">
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
        <Skeleton height="150px" className="rounded-xl" />
      </div>
    );
  if (error) return <div>Error loading events</div>;
  if (!eventsData) return <div>No events found for this group.</div>;
  if (eventsData.length === 0)
    return <div>No events found for this group.</div>;

  return (
    <Flex className='flex-col w-[100%] md:w-[65%]' gap={6}>
      {eventsData.map((event) => (
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
  );
}