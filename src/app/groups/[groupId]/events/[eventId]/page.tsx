"use client";

import EventDetails from "@/components/EventDetails";
import { Avatar } from "@chakra-ui/react";
import { TypographyH3 } from "@/components/ui/typography/h3";
import useSWR from "swr";
import {
  SingleEventDataType,
  SingleEventResponseType,
} from "@/app/api/groups/[groupId]/events/[eventId]/route";
import { notFound } from "next/navigation";
import { SWRProvider } from "@/providers/swrProvider";

interface EventDataProps {
  event: SingleEventDataType;
}

function EventData({ event }: EventDataProps) {
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
      <EventDetails event={event} />
    </div>
  );
}

function _EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  const groupId = params.groupId;
  const eventId = params.eventId;
  const {
    data: event,
    error,
    isLoading,
  } = useSWR<SingleEventResponseType>([`/groups/${groupId}/events/${eventId}`]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading group</div>;

  if (!event || !event.data) return notFound();

  return <EventData event={event.data} />;
}

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <SWRProvider>
      <_EventPage params={params} />
    </SWRProvider>
  );
}
