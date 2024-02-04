"use client";

import {
  Image,
  Button,
  Tag,
  Avatar,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaVideo,
  FaClock,
  FaLocationArrow,
  FaChevronRight
} from "react-icons/fa";
import Link from "next/link";
import { EventType } from "@/app/types/events";
import EventCards from "../EventCards";
import { FaPeopleGroup } from "react-icons/fa6";

// Define the props interface

export default function EventDetails(props: EventType) {
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
    meetingLink,
  } = props;

  const joined = false;

  const joinEventHandler = () => {};

  const samleEvents = [
    {
      id: 1,
      name: "Event 1",
      description: "Description of Event 1",
      displayPhoto:
        "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
      location: "Location 1",
      online: true,
      dateTime: "2024-01-29T18:11:16.620395",
      groupId: 1,
      photos: ["photo_1_1.jpg", "photo_1_2.jpg", "photo_1_3.jpg"],
      materials: ["material_1_1.pdf", "material_1_2.pdf", "material_1_3.pdf"],
      createdAt: "2024-01-29T18:11:16.620416",
      updatedAt: "2024-01-29T18:11:16.620420",
      group: "Group 5",
    },
    {
      id: 2,
      name: "Event 2",
      description: "Description of Event 2",
      displayPhoto:
        "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
      location: "Location 2",
      online: true,
      dateTime: "2024-01-29T18:11:16.620430",
      groupId: 1,
      photos: ["photo_2_1.jpg", "photo_2_2.jpg", "photo_2_3.jpg"],
      materials: ["material_2_1.pdf", "material_2_2.pdf", "material_2_3.pdf"],
      createdAt: "2024-01-29T18:11:16.620442",
      updatedAt: "2024-01-29T18:11:16.620445",
      group: "Group 2",
    },
    {
      id: 3,
      name: "Event 3",
      description: "Description of Event 3",
      displayPhoto:
        "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
      location: "Location 3",
      online: false,
      dateTime: "2024-01-29T18:11:16.620453",
      groupId: 5,
      photos: ["photo_3_1.jpg", "photo_3_2.jpg", "photo_3_3.jpg"],
      materials: ["material_3_1.pdf", "material_3_2.pdf", "material_3_3.pdf"],
      createdAt: "2024-01-29T18:11:16.620463",
      updatedAt: "2024-01-29T18:11:16.620466",
      group: "Group 4",
    },
  ];

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
        {/* change back to without exclaimation mark when done*/}
        {!displayPhoto && (
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
        )}

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
        {sampleAttendees && (
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
        )}

        {/* Pictures */}
        {samplePictures && (
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
        )}

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
          <div className="flex flex-row gap-4 overflow-x-scroll">
            {samleEvents?.map((event, index) => {
              return (
                <EventCards
                  longCard={true}
                  name={event?.name}
                  displayPhoto={event?.displayPhoto}
                  location={event?.location}
                  online={event?.online}
                  dateTime={null}
                  photos={null}
                  materials={null}
                  groupId={groupId}
                  key={index}
                  id={event?.id}
                  description={""}
                  group={null}
                />
              );
            })}
          </div>
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
            <p>Organizer</p>
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

          {!online ? (
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
                  href={meetingLink}
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
              <p>location</p>
            </div>
          )}
        </div>

        <Divider />
        {!joined && (
          <Button
            rounded={"md"}
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
