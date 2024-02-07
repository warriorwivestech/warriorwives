import { Event } from "@/app/api/events/[eventId]/route";
import { apiClient } from "@/app/apiClient";
import EventDetails from "@/app/components/EventDetails";
import { Avatar } from "@chakra-ui/react";
import React from "react";

export default async function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  const event: Event = await apiClient(`/events/${params?.eventId}`, { cache: "no-store" });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col w-[100%]">
        {/* <Button
          w={"min-content"}
          leftIcon={<Icon fontSize={16} as={FaChevronLeft} />}
          variant="solid"
        >
          <Link
            href={`/groups/${params?.groupId}`}
            className="flex flex-row gap-2 align-middle justify-center"
          >
            Back{" "}
          </Link>
        </Button> */}
        {/* Header */}
        <div className="bg-white py-[24px] w-[100%] absolute left-0 top-[60px]">
          <div className="max-w-[1440px] m-auto flex gap-4 flex-col px-[24px] md:px-[48px]">
            <p className="text-heading4 font-bold">
              {event.name}
            </p>

            <div className="flex flex-row gap-4">
              <Avatar name="Host" src={""} />
              <div className="flex flex-col">
                <p>Hosted by</p>

                {/* groupname */}
                <p className="font-bold">{event.groupName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100% pt-[100px]">
        <EventDetails
          id={event.id}
          name={event.name}
          description={event.description}
          displayPhoto={event.displayPhoto}
          location={event.location}
          meetingLink={event.meetingLink}
          dateTime={event.dateTime}
          online={event.online}
          attendees={event.attendees}
          photos={event.photos}
          organizers={event.organizers}
          joined={event.joined}
          groupName={event.groupName}
          groupId={event.groupId}
        />
      </div>
    </div>
  );
}
