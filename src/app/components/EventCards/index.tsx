// EventCards.tsx

import {
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { EventType } from "@/app/types/events";
import { FaLocationArrow } from "react-icons/fa";

interface EventCardsProps {
  id: number;
  name: string;
  description: string;
  displayPhoto: string | null;
  online: boolean;
  meetingLink: string | null;
  location: string | null;
  dateTime: string;
  attendeesCount: number;
  groupId: number;
  longCard?: boolean;
}

export default function EventCards({
  id,
  name,
  description,
  displayPhoto,
  online,
  meetingLink,
  location,
  dateTime,
  attendeesCount,
  groupId,
  longCard = false,
}: EventCardsProps) {
  const joinEventHandler = () => {};
  const displayPhotoUrl =
    displayPhoto || "https://startup.mp.gov.in/assets/img/img-not-found.png";

  return (
    <Link
      href={`/groups/${groupId}/${id}`}
      className={`${longCard ? "min-w-[450px]" : "min-w-[340px]"} `}
    >
      <div className="bg-white rounded-xl p-4 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4 w-[100%]">
          {/* details */}
          <div className="flex flex-col gap-2 w-[100%]">
            {/* dateTime */}
            {/* "2024-02-08T12:00:00.000Z" convert this to "Feb 8, 2024, 12:00 PM" */}
            <p className="font-bold text-[14px] text-green-800 tracking-wider">
              {new Date(dateTime).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>

            {/* name */}
            <Text
              noOfLines={2}
              textOverflow="ellipsis"
              className="font-bold text-[24px]"
            >
              {name}
            </Text>

            {/* location */}
            <div className="flex flex-row gap-4 items-start text-gray-500">
              <FaLocationArrow
                style={{
                  minHeight: "14px",
                  minWidth: "14px",
                  marginTop: "4px",
                }}
              />
              <p>{online ? "Online" : location}</p>
            </div>
          </div>

          {/* image */}
          <div className="w-[100%] max-w-[200px]">
            <Image
              rounded={"xl"}
              alt={"product image"}
              src={displayPhotoUrl}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "130px", lg: "130px" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* description */}
          <div>
            <Text noOfLines={3} textOverflow="ellipsis" className="text-[14px]">
              {description}
            </Text>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <p className="text-gray-500 text-[14px]">
                {`${attendeesCount} attendee(s)`}
              </p>
            </div>

            <Button
              rounded={"md"}
              className="bg-black text-white hover:text-black"
            >
              View event
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
