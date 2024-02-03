"use client";

import EventCards from "@/app/components/EventCards";
import Tags from "@/app/components/common/tags";
import {
  Button,
  Flex,
  SimpleGrid,
  Text,
  Image,
  Stack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { MdPeopleAlt } from "react-icons/md";
import React, { useEffect, useState, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import IconText from "@/app/components/common/icontext";
import { BsPersonRaisedHand } from "react-icons/bs";
import { RiBaseStationFill } from "react-icons/ri";
import { SWRProvider } from "@/app/providers/swrProvider";
import useSWR from "swr";
import { GroupData } from "@/app/api/groups/[groupId]/types";
import { sampleEventData } from "@/app/data/samples";

function GroupData({ group }: { group: GroupData }) {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(70);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY > 70 ? window.scrollY : 70);
      setIsSticky(window.scrollY > 70);

      const scrollY = window.scrollY;
      const newScrollSpeed = Math.abs(scrollY - lastScrollY);
      setScrollSpeed(newScrollSpeed);
      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    id,
    name,
    description,
    displayPhoto,
    tags,
    county,
    state,
    online,
    members,
    membersCount,
    branchOfService,
  } = group;
  const displayPhotoUrl =
    displayPhoto ||
    "https://t4.ftcdn.net/jpg/03/40/52/49/360_F_340524914_pzOWCq4I0WjytxaW8DTVFujrck1gjvvO.jpg";
  const location = county ? `${county}, ${state}` : state;
  const admins = members
    .filter((member) => member.admin)
    .map((member) => member.name);
  const parsedAdmins =
    admins.length > 2
      ? `${admins.slice(0, 2).join(", ")} and ${admins.length - 2} others`
      : admins.join(" and ");
  const isJoined = true;

  const minWidth = 30;
  const width = 50 - scrollPosition / 15;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 justify-between">
      <div className="flex flex-col gap-6">
        <Stack gap={8}>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <Image
              src={displayPhotoUrl}
              alt={name}
              borderRadius="lg"
              className="w-full object-cover h-96"
            />
            <Box
              className={`${isSticky ? "bg-white rounded-xl" : ""} p-7`}
              position="fixed"
              transition={
                "width 0.25s ease, border 1s ease, background 0.5s ease, top 0.2s ease"
              }
              top={!isSticky ? `calc(110px - ${scrollSpeed}px)` : "48px"}
              right="48px"
              width={`${width > minWidth ? width : minWidth}%`}
            >
              <Box>
                <Stack spacing={3}>
                  <Stack>
                    <Tags tags={tags} />
                    <Heading className="heading mb-2">{name}</Heading>
                  </Stack>
                  <Stack spacing={2}>
                    {online && (
                      <IconText
                        icon={RiBaseStationFill}
                        iconClassName="text-green-500"
                        textClassName="uppercase text-green-500 tracking-wider font-bold"
                      >
                        ONLINE ONLY
                      </IconText>
                    )}
                    <IconText
                      icon={FaMapMarkerAlt}
                      iconClassName="text-red-700"
                    >
                      {location}
                    </IconText>
                    <IconText icon={MdPeopleAlt} iconClassName="text-blue-400">
                      {`${membersCount} members`}
                    </IconText>
                    <IconText
                      icon={BsPersonRaisedHand}
                      iconClassName="text-gray-500"
                    >
                      Organised by {parsedAdmins}
                    </IconText>
                  </Stack>
                  <Button
                    rounded={"md"}
                    isDisabled={isJoined}
                    className={`${
                      !isJoined && "bg-black text-white hover:text-black"
                    } w-full mt-4`}
                  >
                    {isJoined ? "Joined" : "Join Group"}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </SimpleGrid>
          <Flex className="flex-col gap-4">
            <p className="text-heading5">Description</p>
            <Text
              textOverflow={"ellipsis"}
              width={`${width > minWidth ? width + 50 : minWidth + 25}%`}
              transition={"width 0.25s ease"}
              ref={descriptionRef}
              className="break-all"
            >
              {description}
            </Text>
          </Flex>
        </Stack>
        <p className="text-heading4">Events from {name}</p>
        <Flex className="flex-col w-[65%]" gap={6}>
          {sampleEventData.map((event, index) => (
            <EventCards
              name={""}
              displayPhoto={""}
              location={""}
              online={false}
              dateTime={null}
              photos={[]}
              materials={[]}
              groupId={String(id)}
              key={index}
              id={0}
              description={""}
              group={null}
            />
          ))}
        </Flex>
      </div>
    </div>
  );
}

function _GroupPage({ params }: { params: { groupId: string } }) {
  const {
    data: group,
    error,
    isLoading,
  } = useSWR<GroupData>(`http://localhost:3000/api/groups/${params.groupId}`);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading group</div>;
  if (!group) return <div>Not found</div>;

  return <GroupData group={group} />;
}

export default function GroupPage({ params }: { params: { groupId: string } }) {
  return (
    <SWRProvider>
      <_GroupPage params={params} />
    </SWRProvider>
  );
}
