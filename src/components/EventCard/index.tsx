import { GroupEvents } from "@/app/api/groups/[groupId]/events/route";
import { JoinedEvents } from "@/data/joinedEvents";
import { Text, Card } from "@chakra-ui/react";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa";
import { Button } from "../ui/button";
import Image from "next/image";

interface EventCardProps {
  event: JoinedEvents[0] | GroupEvents[0];
  longCard?: boolean;
}

export default function EventCard({ event, longCard = false }: EventCardProps) {
  const {
    id,
    name,
    description,
    displayPhoto,
    online,
    location,
    startDateTime,
    attendeesCount,
    groupId,
  } = event;

  const displayPhotoUrl =
    displayPhoto || "https://startup.mp.gov.in/assets/img/img-not-found.png";
  const attendeesText = attendeesCount === 1 ? "attendee" : "attendees";

  return (
    <Link
      href={`/groups/${groupId}/events/${id}`}
      className={`${longCard ? "min-w-[450px]" : "min-w-[340px]"} `}
    >
      <Card>
        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <p className="font-semibold text-md text-gray-500">
                {startDateTime}
              </p>
              <Text
                noOfLines={2}
                textOverflow="ellipsis"
                className="font-bold text-[24px]"
              >
                {name}
              </Text>

              <div className="flex flex-row gap-4 items-start text-gray-500 text-sm">
                <FaLocationArrow
                  style={{
                    minHeight: "14px",
                    minWidth: "14px",
                    marginTop: "3px",
                  }}
                />
                <p>{online ? "Online" : location}</p>
              </div>
            </div>

            <div className="w-full h-48 sm:h-32 sm:w-64 relative">
              <Image
                src={displayPhotoUrl}
                alt={`Event image for ${name}`}
                fill
                className="rounded-md object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Text
                noOfLines={3}
                textOverflow="ellipsis"
                className="text-[14px]"
              >
                {description}
              </Text>
            </div>

            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <p className="text-gray-500 text-sm">
                  {`${attendeesCount} ${attendeesText}`}
                </p>
              </div>

              <Button>View event</Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
