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
  useMediaQuery,
  Badge,
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
import GroupLoading from "./loading";
import { CreateEventModal } from "@/app/components/CreateEventModal";
import { GiLightningBranches } from "react-icons/gi";
import { generateColorFromString } from "@/app/components/Map";

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

  return (
    <div className='flex flex-col-reverse md:flex-row gap-8 justify-between'>
      <div className='flex flex-col gap-16'>
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
              width={`${desktopSize && (cardWidth > cardMinWidth ? cardWidth : cardMinWidth)}%`}
              top={!isSticky ? `calc(110px - ${scrollSpeed}px)` : "48px"}
              right='48px'
            >
              <Box>
                <Stack spacing={5}>
                  <Stack spacing={1}>
                    <span>
                      <Badge
                      className="px-[4px] py-[2px] rounded-sm"
                        background={generateColorFromString(
                          parsedBranchOfService,
                          "99"
                        )}
                      >
                        {parsedBranchOfService}
                      </Badge>
                    </span>
                    <Heading className='heading mb-2'>{name}</Heading>
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
                    <CreateEventModal groupName={name} />
                  ) : (
                    <Button
                      rounded={"md"}
                      isDisabled={joined}
                      className={`${
                        !joined && "bg-black text-white hover:text-black"
                      } w-full mt-4`}
                    >
                      {joined ? "Joined" : "Join Group"}
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
                desktopSize && (descWidth > descMinWidth ? descWidth + 50 : descMinWidth + 25)
              }%`}
              transition={"width 0.25s ease"}
              ref={descriptionRef}
              className="break-all"
            >
              {description}
            </Text>
          </Flex>
        </Stack>
        <Stack gap={4}>
          <p className='text-heading4'>Events from {name}</p>
          <Flex className='flex-col w-[100%] md:w-[65%]' gap={6}>
            {sampleEventData.map((event, index) => (
              <EventCards
                name={event?.title}
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
        </Stack>
      </div>
    </div>
  );
}

function _GroupPage({ params }: { params: { groupId: string } }) {
  const {
    data: group,
    error,
    isLoading,
  } = useSWR<GroupData>(`/groups/${params.groupId}`);

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
