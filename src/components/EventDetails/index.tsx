"use client";

import { Divider, Spinner, Image as ChakraImage } from "@chakra-ui/react";
import {
  FaVideo,
  FaClock,
  FaLocationArrow,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import { FaPeopleGroup } from "react-icons/fa6";
import OtherEvents from "./OtherEvents";
import { apiClient } from "@/apiClient";
import { useState } from "react";
import { EditEvent } from "../EventModal/EditEvent";
import { TypographyH4 } from "../ui/typography/h4";
import { Card } from "../ui/card";
import { SingleEventDataType } from "@/app/api/groups/[groupId]/events/[eventId]/route";
import Image from "next/image";
import { Button } from "../ui/button";
import AttendeeCard from "./AttendeeCard";
import { parseEventDateTimes } from "@/helpers/dateParser";

interface EventDetailsProps {
  event: SingleEventDataType;
}

export default function EventDetails({ event }: EventDetailsProps) {
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
    joined,
    groupName,
    groupId,
    attendeesCount,
    organizersCount,
  } = event;

  const totalAttendeesAndOrganizers = attendeesCount + organizersCount;

  const [justJoined, setJustJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const joinEventHandler = async () => {
    // join event
    // TODO: UPDATE USER ID
    setIsJoining(true);
    const response = await apiClient("/events/join", {
      method: "POST",
      body: JSON.stringify({ eventId: id, userId: 3 }),
    });

    // if success, set joined to true
    if (response) {
      setJustJoined(true);
    }
    setIsJoining(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 justify-between">
      <div className="flex flex-col gap-8 w-full md:w-[65%]">
        {displayPhoto && (
          <Image
            src={displayPhoto}
            alt={name}
            width={100}
            height={100}
            className="w-full h-96 object-cover rounded-md md:h-[400px] lg:h-[500px]"
          />
        )}

        <div className="flex flex-col gap-4">
          <TypographyH4>Description</TypographyH4>
          <p className="text-gray-700">{description}</p>
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
                <p>Online</p>
                <a
                  href={meetingLink || "#"}
                  target="_blank"
                  className="cursor-pointer text-blue-500"
                >
                  Join Meeting
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
              <p>{location}</p>
            </div>
          )}
        </div>

        {/* TODO: Only show for admin */}
        <EditEvent
          groupName={groupName}
          groupId={groupId}
          eventData={{
            id,
            name,
            description,
            displayPhoto,
            location,
            meetingLink,
            online,
            startDateTime: startDateTime as unknown as Date,
            endDateTime: endDateTime as unknown as Date,
            attendees,
            photos,
            organizers,
            joined,
            groupName,
            groupId,
          }}
        />

        <Divider />
        {joined || justJoined ? (
          <Button disabled={true}>Joined</Button>
        ) : (
          <Button onClick={joinEventHandler} disabled={isJoining}>
            {isJoining ? <Spinner /> : "Join Event"}
          </Button>
        )}
      </Card>
    </div>
  );
}
