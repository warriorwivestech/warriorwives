"use client";

import { Image, Button, Avatar, Divider, Spinner } from "@chakra-ui/react";
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

// Define the props interface
interface EventDetailsProps {
  id: number;
  name: string;
  description: string;
  displayPhoto: string | null;
  location: string | null;
  meetingLink: string | null;
  startDateTime: string;
  endDateTime: string;
  online: boolean;
  attendees: string[];
  photos: string[];
  organizers: string[];
  joined: boolean;
  groupName: string;
  groupId: number;
}

export default function EventDetails({
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
}: EventDetailsProps) {
  const displayPhotoUrl =
    displayPhoto || "https://startup.mp.gov.in/assets/img/img-not-found.png";
  // last organizer is should be "and" instead of ","
  const lastOrganizer = organizers[organizers.length - 1];
  const otherOrganizers = organizers.slice(0, -1).join(", ");
  const organizersString =
    organizers.length === 0 ? "" : `${otherOrganizers} and ${lastOrganizer}`;
  const startDateTimeFormat = new Date(startDateTime).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  // endDateTime is one hour after startDateTime
  const endDateTimeFormat = new Date(
    new Date(endDateTime).getTime() + 60 * 60 * 1000
  ).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

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
      {/* content */}

      <div className="flex flex-col gap-8 w-full md:w-[65%]">
        {/* banner image */}
        {/* change back to without exclaimation mark when done*/}
        {displayPhotoUrl && (
          <Image
            rounded={"md"}
            alt={"product image"}
            src={displayPhotoUrl}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        )}

        <div className="flex flex-col gap-4">
          <TypographyH4>Description</TypographyH4>
          <p className="text-gray-700">{description}</p>
        </div>

        {/* Attendees */}
        {attendees && (
          <div className="flex flex-col gap-4">
            <p className="text-heading5">{attendees.length} Attendees</p>
            <div className="bg-white rounded-xl w-[100%] flex flex-row p-6 gap-4 overflow-x-scroll">
              {attendees.map((attendee) => {
                return (
                  <div
                    className="bg-white p-4 shadow-lg text-center flex flex-col justify-center items-center gap-4"
                    key={attendee}
                  >
                    <Avatar
                      size="2xl"
                      name={attendee}
                      src={
                        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais"
                      }
                    />
                    <p className="font-bold">{attendee}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pictures */}
        {photos.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-heading5">{photos.length} Pictures</p>
            <div className="rounded-xl w-[100%] flex flex-row gap-4 overflow-x-scroll">
              {photos.map((photos, index) => {
                return (
                  <div
                    className="bg-white p-4 shadow-lg text-center flex flex-col justify-center items-center gap-4 rounded-xl w-[100%]"
                    key={index}
                  >
                    <Image
                      rounded={"md"}
                      alt={"product image"}
                      src={photos}
                      fit={"cover"}
                      align={"center"}
                      minW={"300px"}
                      h={{ base: "100%", sm: "200px", lg: "200px" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Divider h={4} />

        {/* Events */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <p className="text-heading5">Other events by {groupName}</p>
            <div className="flex flex-row gap-2 justify-center items-center">
              <Link className="font-bold" href={`/groups/${groupId}`}>
                View all
              </Link>
              <FaChevronRight />
            </div>
          </div>
          <OtherEvents groupId={groupId} eventId={id} />
        </div>
      </div>

      {/* sticky tab */}
      <Card className="flex flex-col gap-4 w-full h-full md:sticky md:top-10 md:w-[30%] p-4">
        <div className="flex flex-col gap-4 w-full p-2">
          {/* <div className="gap-2 flex flex-row flex-wrap">
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
          </div> */}

          <div className="flex flex-row gap-4 items-center">
            <FaClock style={{ minHeight: "18px", minWidth: "18px" }} />
            <p className="text-gray-700">{`${startDateTime} to ${endDateTime}`}</p>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <FaPeopleGroup style={{ minHeight: "18px", minWidth: "18px" }} />
            <p className="text-sm text-gray-700">{`Organized by ${
              organizersString ? organizersString : "Jackson"
            }`}</p>
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
            startDateTime: startDateTimeFormat as unknown as Date,
            endDateTime: endDateTimeFormat as unknown as Date,
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
          <Button rounded={"md"} className="border" isDisabled={true}>
            Joined
          </Button>
        ) : (
          <Button
            rounded={"md"}
            className="bg-black text-white hover:text-black"
            onClick={joinEventHandler}
            isDisabled={isJoining}
          >
            {isJoining ? <Spinner /> : "Join Event"}
          </Button>
        )}
      </Card>
    </div>
  );
}
