"use client";

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
  useMediaQuery,
  Badge,
  Spinner,
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
import GroupLoading from "./loading";
import { CreateEventModal } from "@/app/components/CreateEventModal";
import { apiClient } from "@/app/apiClient";
import GroupEventsData from "./components/GroupEventsData";

export function getGroupEventsRequestOptions(groupId: string): RequestInit {
  return { next: { tags: ["group", groupId, "events"], revalidate: 60 * 5 } };
}

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
    branchOfService,
    description,
    displayPhoto,
    tags,
    county,
    state,
    online,
    membersCount,
    groupAdmin,
    joined,
    admins,
  } = group;
  const displayPhotoUrl =
    displayPhoto ||
    "https://t4.ftcdn.net/jpg/03/40/52/49/360_F_340524914_pzOWCq4I0WjytxaW8DTVFujrck1gjvvO.jpg";
  const location = county ? `${county}, ${state}` : state;
  const parsedAdmins =
    admins.length > 2
      ? `${admins.slice(0, 2).join(", ")} and ${admins.length - 2} others`
      : admins.join(" and ");

  const cardMinWidth = 30;
  const cardWidth = 50 - scrollPosition / 15;

  const descMinWidth = 60;
  const descWidth = 100 - (isSticky ? scrollPosition / 3 : 0);

  const parsedBranchOfService =
    branchOfService === "Any" ? "All Branches" : branchOfService;
  const [desktopSize] = useMediaQuery("(min-width: 1024px)");

  const {
    data: eventsData,
    error,
    isLoading,
  } = useSWR([
    `/groups/${id}/events`,
    getGroupEventsRequestOptions(id.toString()),
  ]);

  const [justJoined, setJustJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const joinEventHandler = async () => {
    // join group
    // TODO: UPDATE USER ID
    setIsJoining(true);
    const response = await apiClient("/groups/join", {
      method: "POST",
      body: JSON.stringify({ groupId: id, userId: 3 }),
    });

    // if success, set joined to true
    if (response) {
      setJustJoined(true);
    }
    setIsJoining(false);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 justify-between">
      <div className="flex flex-col gap-16">
        <Stack gap={8}>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <Image
              src={displayPhotoUrl}
              alt={name}
              borderRadius="lg"
              className="w-full object-cover h-64 md:h-96"
            />
            <Box
              className={`${
                isSticky && desktopSize ? "bg-white rounded-xl border" : ""
              } ${!desktopSize && "bg-white"}  lg:fixed p-7 rounded-xl `}
              transition={
                "width 0.25s ease, background 0.5s ease, top 0.2s ease"
              }
              top={
                !isSticky && desktopSize
                  ? `calc(110px - ${scrollSpeed}px)`
                  : "48px"
              }
              right="48px"
              width={`${
                desktopSize &&
                (cardWidth > cardMinWidth ? cardWidth : cardMinWidth)
              }%`}
            >
              <Box>
                <Stack spacing={5}>
                  <Stack spacing={1}>
                    <span>
                      <Badge
                        w={"auto"}
                        className="px-[4px] py-[2px] rounded-sm"
                        colorScheme="gray"
                      >
                        {parsedBranchOfService}
                      </Badge>
                    </span>
                    <Heading className="heading mb-2">{name}</Heading>
                    <Tags tags={tags} />
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

                  {groupAdmin ? (
                    <CreateEventModal groupName={name} groupId={id} />
                  ) : joined || justJoined ? (
                    <Button
                      rounded={"md"}
                      className="w-full mt-4 border"
                      isDisabled={true}
                    >
                      Joined
                    </Button>
                  ) : (
                    <Button
                      rounded={"md"}
                      className="bg-black text-white hover:text-black w-full mt-4"
                      onClick={joinEventHandler}
                      disabled={isJoining}
                    >
                      {isJoining ? <Spinner /> : "Join Group"}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </SimpleGrid>
          <Flex className="flex-col gap-4">
            <p className="text-heading5">Description</p>
            <Text
              textOverflow={"ellipsis"}
              width={`${
                desktopSize &&
                (descWidth > descMinWidth ? descWidth : descMinWidth)
              }%`}
              transition={"width 0.25s ease"}
              ref={descriptionRef}
              className="break-words"
            >
              {description}
            </Text>
          </Flex>
        </Stack>
        <Stack gap={4}>
          <p className="text-heading4">Events from {name}</p>
          <GroupEventsData
            eventsData={eventsData}
            isLoading={isLoading}
            error={error}
          />
        </Stack>
      </div>
    </div>
  );
}

export function getSingleGroupRequestOptions(groupId: string): RequestInit {
  return {
    cache: "force-cache",
    next: { tags: ["group", groupId], revalidate: 60 * 5 },
  };
}

function _GroupPage({ params }: { params: { groupId: string } }) {
  const groupId = params.groupId;
  const {
    data: group,
    error,
    isLoading,
  } = useSWR<GroupData>([
    `/groups/${groupId}`,
    getSingleGroupRequestOptions(groupId),
  ]);

  if (isLoading) return <GroupLoading />;
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
