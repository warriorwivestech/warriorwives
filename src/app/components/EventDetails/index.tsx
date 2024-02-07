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
import { apiClient } from "@/app/apiClient";
import { useState } from "react";

// Define the props interface
interface EventDetailsProps {
  id: number;
  name: string;
  description: string;
  displayPhoto: string | null;
  location: string | null;
  meetingLink: string | null;
  dateTime: string;
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
  dateTime,
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
  const startDateTime = new Date(dateTime).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  // endDateTime is one hour after startDateTime
  const endDateTime = new Date(
    new Date(dateTime).getTime() + 60 * 60 * 1000
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
    <div className="flex flex-col-reverse md:flex-row gap-8 justify-between">
      {/* content */}

      <div className="flex flex-col gap-8 w-[100%] md:w-[65%]">
        {/* banner image */}
        {/* change back to without exclaimation mark when done*/}
        {!displayPhotoUrl && (
          <Image
            rounded={"xl"}
            alt={"product image"}
            src={displayPhotoUrl}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        )}

        {/* description */}
        <div className="flex flex-col gap-4">
          <p className="text-heading5">Description</p>
          <p>{description}</p>
        </div>

        {/* Attendees */}
        {attendees && (
          <div className="flex flex-col gap-4">
            <p className="text-heading5">Attendees {attendees.length}</p>
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
            <p className="text-heading5">Pictures {photos.length}</p>
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
      <div className="md:sticky md:top-10 flex flex-col gap-4 w-[100%] md:w-[25%] h-[100%]">
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 w-[100%]">
          {/* <div className="gap-2 flex flex-row flex-wrap">
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
          </div> */}

          <div className="flex flex-row gap-4 items-start">
            <FaPeopleGroup
              style={{ minHeight: "18px", minWidth: "18px", marginTop: "4px" }}
            />
            <p>{`Organized by ${organizersString}`}</p>
          </div>

          <div className="flex flex-row gap-4 items-start">
            <FaClock
              style={{ minHeight: "18px", minWidth: "18px", marginTop: "4px" }}
            />
            <p>{`${startDateTime} to ${endDateTime}`}</p>
          </div>

          {online ? (
            <div className="flex flex-row gap-4 items-start">
              <FaVideo
                style={{
                  minHeight: "18px",
                  minWidth: "18px",
                  marginTop: "4px",
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
            <div className="flex flex-row gap-4 items-start">
              <FaLocationArrow
                style={{
                  minHeight: "18px",
                  minWidth: "18px",
                  marginTop: "4px",
                }}
              />
              <p>{location}</p>
            </div>
          )}
        </div>

        <Divider />
        {joined || justJoined ? (
          <Button rounded={"md"} className="" disabled>
            Joined
          </Button>
        ) : (
          <Button
            rounded={"md"}
            className="bg-black text-white hover:text-black"
            onClick={joinEventHandler}
            disabled={isJoining}
          >
            {isJoining ? <Spinner /> : "Join Event"}
          </Button>
        )}
      </div>
    </div>
  );
}
