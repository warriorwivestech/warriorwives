"use client";

import { Divider, Image as ChakraImage } from "@chakra-ui/react";
import {
  FaVideo,
  FaClock,
  FaLocationArrow,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import OtherEvents from "./OtherEvents";
import { TypographyH4 } from "@/components/ui/typography/h4";
import { Card } from "@/components/ui/card";
import { SingleEventDataType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import { Button } from "@/components/ui/button";
import AttendeeCard from "./AttendeeCard";
import { parseEventDateTimes } from "@/helpers/dateParser";
import { SWRResponse } from "swr";
import { UserDataType } from "@/app/api/user/route";
import EventActionButtons from "./EventActionButtons";

interface EventDetailsProps {
  event: SingleEventDataType;
  user: SWRResponse<UserDataType, any, any>;
}

export default function EventDetails({ event, user }: EventDetailsProps) {
  const {
    id,
    name,
    description,
    displayPhoto,
    location,
    meetingLink,
    online,
    startDateTime,
    endDateTime,
    attendees,
    photos,
    organizers,
    groupName,
    groupId,
    attendeesCount,
    organizersCount,
  } = event;

  const totalAttendeesAndOrganizers = attendeesCount + organizersCount;

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 justify-between">
      <div className="flex flex-col gap-8 w-full md:w-[65%]">
        {displayPhoto && (
          <ChakraImage
            rounded={"md"}
            alt={name}
            src={displayPhoto}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        )}

        <div className="flex flex-col gap-4">
          <TypographyH4>Description</TypographyH4>
          <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        </div>

        {totalAttendeesAndOrganizers > 0 && (
          <div className="flex flex-col gap-4">
            <TypographyH4>
              Attendees ({totalAttendeesAndOrganizers})
            </TypographyH4>
            <Card className="w-full flex flex-row p-6 gap-4 overflow-x-scroll">
              {organizers.map((organizer) => {
                return (
                  <AttendeeCard
                    src={organizer.image as string}
                    name={organizer.name as string}
                    alt={organizer.name as string}
                    role="Organizer"
                    key={organizer.id}
                  />
                );
              })}

              {attendees.map((attendee) => {
                return (
                  <AttendeeCard
                    src={attendee.image as string}
                    name={attendee.name as string}
                    alt={attendee.name as string}
                    role="Member"
                    key={attendee.id}
                  />
                );
              })}
            </Card>
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div className="flex flex-col gap-4">
            <TypographyH4>Photos ({photos.length})</TypographyH4>
            <Card className="w-full flex flex-row p-6 gap-4 overflow-x-scroll">
              {photos.map((photo, index) => {
                return (
                  <Card
                    className="p-2 text-center flex flex-col justify-center items-center gap-4"
                    key={index}
                  >
                    <ChakraImage
                      rounded={"md"}
                      alt={"product image"}
                      src={photo.photo}
                      fit={"cover"}
                      align={"center"}
                      minW={"300px"}
                      h={{ base: "100%", sm: "200px", lg: "200px" }}
                    />
                  </Card>
                );
              })}
            </Card>
          </div>
        )}

        <Divider h={4} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <TypographyH4>Other events by {groupName}</TypographyH4>
            <div className="flex flex-row gap-1 justify-center items-center">
              <Link href={`/groups/${groupId}`}>
                <Button variant="link" size="default">
                  View All
                  <div className="ml-1">
                    <FaChevronRight />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <OtherEvents groupId={groupId} eventId={id} />
        </div>
      </div>

      {/* sticky tab */}
      <Card className="flex flex-col gap-4 w-full h-full md:sticky md:top-10 md:w-[30%] p-4">
        <div className="flex flex-col gap-4 w-full p-2">
          <div className="flex flex-row gap-4 items-center">
            <FaClock style={{ minHeight: "18px", minWidth: "18px" }} />
            <p className="text-gray-700 tracking-tight">
              {parseEventDateTimes(startDateTime, endDateTime)}
            </p>
          </div>

          {online ? (
            <div className="flex flex-row gap-4 items-center">
              <FaVideo
                style={{
                  minHeight: "18px",
                  minWidth: "18px",
                }}
              />
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-gray-500">
                  This event is hosted online
                </p>
                <a
                  href={meetingLink ? (/^(?:https?:\/\/)/i.test(meetingLink) ? meetingLink : `http://${meetingLink}`) : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  Online Meeting Link
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 items-center">
              <FaLocationArrow
                style={{
                  minHeight: "18px",
                  minWidth: "18px",
                }}
              />
              <p className="text-gray-700">{location}</p>
            </div>
          )}
        </div>
        <EventActionButtons event={event} user={user} />
      </Card>
    </div>
  );
}
