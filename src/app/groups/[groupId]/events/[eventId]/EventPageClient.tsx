"use client";

import EventDetails from "@/app/groups/[groupId]/events/[eventId]/components/EventDetails";
import { Avatar } from "@chakra-ui/react";
import { TypographyH3 } from "@/components/ui/typography/h3";
import useSWR, { SWRResponse } from "swr";
import {
  SingleEventDataType,
  SingleEventResponseType,
} from "@/app/api/groups/[groupId]/events/[eventId]/route";
import { notFound } from "next/navigation";
import { SWRProvider } from "@/providers/swrProvider";
import { UserDataType } from "@/app/api/user/route";
import { getUserRequestOptions } from "@/app/api/user/helper";
import EventsLoading from "./loading";
import Link from "next/link";
import UserVerifiedRoute from "@/components/UserVerifiedRoute";

interface EventDataProps {
  event: SingleEventDataType;
  user: SWRResponse<UserDataType, any, any>;
}

function EventData({ event, user }: EventDataProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col w-full">
        <div className="flex gap-4 flex-col">
          <TypographyH3>{event.name}</TypographyH3>
          <div className="flex flex-row gap-4">
            <Avatar name="Host" src={""} />
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm">Hosted by</p>
              <Link href={`/groups/${event.groupId}`}>
                <p className="text-gray-700 font-semibold">{event.groupName}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <EventDetails event={event} user={user} />
    </div>
  );
}

export default function EventPageClient({
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
  const user = useSWR<UserDataType>(["/user", getUserRequestOptions()]);

  if (isLoading) return <EventsLoading />;
  if (error)
    return <div className="text-gray-600 text-sm">Error loading event</div>;

  if (!event || !event.data) return notFound();

  return <EventData event={event.data} user={user} />;
}
