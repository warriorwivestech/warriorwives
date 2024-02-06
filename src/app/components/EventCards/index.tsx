// EventCards.tsx

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Flex,
  Image,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { EventType } from "@/app/types/events";
import { FaLocationArrow } from "react-icons/fa";

export default function EventCards(props: EventType) {
  const {
    id,
    name,
    description,
    displayPhoto,
    location,
    online,
    dateTime,
    group,
    materials,
    photos,
    groupId,
    longCard,
  } = props;

  const joinEventHandler = () => {};

  const sampleAttendees = [
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
    {
      image:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1448711260.1706400000&semt=ais",
      name: "Raju",
    },
  ];

  return (
    <Link
      href={`${1}/${2}`}
      className={`${longCard ? "min-w-[450px]" : "min-w-[340px]"} `}
    >
      <div className="bg-white rounded-xl p-4 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4 w-[100%]">
          {/* details */}
          <div className="flex flex-col gap-2 w-[100%]">
            {/* dateTime */}
            <p className="font-bold text-[14px] text-green-800 tracking-wider">
              SAT, FEB 3
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
              <p>location</p>
            </div>
          </div>

          {/* image */}
          <div className="w-[100%] max-w-[200px]">
            <Image
              rounded={"xl"}
              alt={"product image"}
              src={
                "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
              }
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
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type
            </Text>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              {/* <Avatar
                size="sm"
                name="Rajesh"
                src="https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
              /> */}
              <p className="text-gray-500 text-[14px]">
                {`${sampleAttendees?.length} attendee(s)`}
              </p>
            </div>

            <Button
              rounded={"md"}
              className="bg-black text-white hover:text-black"
              onClick={() => joinEventHandler()}
            >
              View event
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
