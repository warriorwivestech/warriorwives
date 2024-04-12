import { Event } from "@/app/api/events/[eventId]/route";
import { apiClient } from "@/apiClient";
import EventDetails from "@/components/EventDetails";
import { Avatar } from "@chakra-ui/react";
import React from "react";
import { TypographyH2 } from "@/components/ui/typography/h2";
import { TypographyH3 } from "@/components/ui/typography/h3";

export default async function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  const event: Event = await apiClient(`/events/${params?.eventId}`, {
    cache: "no-store",
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col w-full">
        <div className="flex gap-4 flex-col">
          <TypographyH3>{event.name}</TypographyH3>
          <div className="flex flex-row gap-4">
            <Avatar name="Host" src={""} />
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm">Hosted by</p>
              <p className="text-gray-700 font-semibold">{event.groupName}</p>
            </div>
          </div>
        </div>
      </div>
      <EventDetails
        id={event.id}
        name={event.name}
        description={event.description}
        displayPhoto={event.displayPhoto}
        location={event.location}
        meetingLink={event.meetingLink}
        startDateTime={event?.startDateTime}
        endDateTime={event?.endDateTime}
        online={event.online}
        attendees={event.attendees}
        photos={event.photos}
        organizers={event.organizers}
        joined={event.joined}
        groupName={event.groupName}
        groupId={event.groupId}
      />
    </div>
  );
}
