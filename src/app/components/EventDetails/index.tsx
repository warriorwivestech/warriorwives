"use client";

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  HStack,
  Tag,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import {
  FaVideo,
  FaClock,
  FaLocationArrow,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import Link from "next/link";

// Define the props interface
interface EventDetailsProps {
  title: string;
  location: string;
  timing: string;
  description: string;
  materials: string[];
  images: string[];
  eventType: string;
  groupId: string;
}

export default function EventDetails(props: EventDetailsProps) {
  const {
    title,
    location,
    timing,
    description,
    materials,
    images,
    eventType,
    groupId,
  } = props;

  const joined = false;

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

  const samplePictures = [
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 justify-between">
      {/* content */}

      <div className="flex flex-col gap-8 w-[100%] md:w-[65%]">
        {/* banner image */}
        <Image
          rounded={"xl"}
          alt={"product image"}
          src={
            "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
          }
          fit={"cover"}
          align={"center"}
          w={"100%"}
          h={{ base: "100%", sm: "400px", lg: "500px" }}
        />
        {/* description */}
        <div className="flex flex-col gap-4">
          <p className="text-heading5">Description</p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
        </div>

        {/* Attendees */}
        <div className="flex flex-col gap-4">
          <p className="text-heading5">Attendees {sampleAttendees?.length}</p>
          <div className="bg-white rounded-xl w-[100%] flex flex-row p-6 gap-4 overflow-x-scroll">
            {sampleAttendees.map((attendee) => {
              return (
                <div className="bg-white p-4 shadow-lg text-center flex flex-col justify-center items-center gap-4">
                  <Avatar
                    size="2xl"
                    name={attendee?.name}
                    src={attendee?.image}
                  />
                  <p className="font-bold">{attendee?.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pictures */}
        <div className="flex flex-col gap-4">
          <p className="text-heading5">Pictures {samplePictures?.length}</p>
          <div className="rounded-xl w-[100%] flex flex-row gap-4 overflow-x-scroll">
            {samplePictures.map((picture) => {
              return (
                <div className="bg-white p-4 shadow-lg text-center flex flex-col justify-center items-center gap-4 rounded-xl w-[100%]">
                  <Image
                    rounded={"md"}
                    alt={"product image"}
                    src={picture}
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

        <Divider h={4} />

        {/* Events */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <p className="text-heading5">Other events</p>
            <div className="flex flex-row gap-2 justify-center items-center">
              <Link className="font-bold" href={`/groups/${groupId}`}>
                View all
              </Link>
              <FaChevronRight />
            </div>
          </div>
          events
        </div>
      </div>

      {/* sticky tab */}
      <div className="md:sticky md:top-10 flex flex-col gap-4 w-[100%] md:w-[25%] h-[100%]">
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 w-[100%]">
          <div className="gap-2 flex flex-row flex-wrap">
            {/* tags */}
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
          </div>

          <div className="flex flex-row gap-4 items-start">
            <FaClock
              style={{ minHeight: "18px", minWidth: "18px", marginTop: "4px" }}
            />
            <p>
              Tuesday, January 30, 2024 at 8:30 PM to Tuesday, January 30, 2024
              at 9:30 PM MYT
            </p>
          </div>

          {eventType === "Online" ? (
            <div className="flex flex-row gap-4 items-start">
              <FaVideo
                style={{
                  minHeight: "18px",
                  minWidth: "18px",
                  marginTop: "4px",
                }}
              />
              <p>Online</p>
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
              <p>location</p>
            </div>
          )}
        </div>

        <Divider />
        {!joined && (
          <Button
            rounded={"xl"}
            className="bg-black text-white hover:text-black"
            onClick={() => joinEventHandler()}
          >
            Join event
          </Button>
        )}
      </div>
    </div>
  );
}
