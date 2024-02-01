"use client";

import EventCards from "@/app/components/EventCards";
import Tags from "@/app/components/common/tags";
import {
  Button,
  Flex,
  SimpleGrid,
  Tag,
  Text,
  Image,
  Stack,
  Heading,
  Box,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { MdPeopleAlt } from "react-icons/md";
import React, { useEffect, useState, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import IconText from "@/app/components/common/icontext";
import { BsPersonRaisedHand } from "react-icons/bs";
import { RiBaseStationFill } from "react-icons/ri";

export default function EventsPage({
  params,
}: {
  params: { groupId: string };
}) {
  // sample data to be replaced
  const group = {
    id: 1,
    name: "Alpha Team",
    description:
      "Special Operations UnitSpecial Operations UniSpecial Operations UniSpecial Operations UniSpecial UniSOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpeOperations UniSpecial Operations UniSpecial Operations UniSpecial UniSpepecial Operations UniSpecial OperationsSpecial Operations UnitSpecial Operations Uni",
    displayPhoto:
      "https://t4.ftcdn.net/jpg/03/40/52/49/360_F_340524914_pzOWCq4I0WjytxaW8DTVFujrck1gjvvO.jpg",
    branchOfService: "Army",
    county: "XYZ County",
    state: "California",
    online: true,
    members: [],
    tags: ["Special Operations", "Tactical", "Alpha"],
    events: [],
  };
  const admins = ["Johnny boy", "Jimmy Neutron", "Testing Name", "lols"];
  const processedAdmins = `${admins.slice(0, 1)} and ${
    admins.length > 2 ? `${admins.length - 1} others` : admins.slice(1, 2)
  }`;
  const numberOfMembers = 420;

  const eventData = Array.from({ length: 10 }, (_, index) => ({
    id: `${index}`,
    group: `${params?.groupId}`,
    title: `Event Title ${index + 1}`,
    description:
      "This is a sample description for the event., This is a sample description for the event., This is a sample description for the event.,This is a sample description for the event., This is a sample description for the event.",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: `Feb ${index + 1}, 2024`,
    readTime: `${index + 1}min read`,
    author: `Author Name ${index + 1}`,
    authorImageUrl: "https://avatars0.githubusercontent.com/u/1164541?v=4",
  }));

  const [isSticky, setIsSticky] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(70);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [linesCount, setLinesCount] = useState(0);

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
    const pElement = descriptionRef.current;
    const lineHeight = window.getComputedStyle(pElement!).lineHeight;
    const elementHeight = pElement!.clientHeight;
    const lines = Math.floor(elementHeight / parseInt(lineHeight, 10));
    setLinesCount(lines > 0 ? lines : 1);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const minWidth = 30;
  const width = 50 - scrollPosition / 15;

  return (
    <div className='flex flex-col-reverse md:flex-row gap-8 justify-between'>
      <div className='flex flex-col gap-6'>
        <Stack gap={8}>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <Image
              src={group.displayPhoto}
              alt={group.name}
              borderRadius='lg'
              className='w-full object-cover h-96'
            />
            <Card
              className={
                !isSticky ? "border-none bg-transparent shadow-none" : ""
              }
              position='fixed'
              transition={
                "width 0.25s ease, border 1s ease, background 0.5s ease, top 0.3s ease"
              }
              top={!isSticky ? `calc(110px - ${scrollSpeed}px)` : "48px"}
              right='48px'
              width={`${width > minWidth ? width : minWidth}%`}
            >
              <CardBody>
                <Box>
                  <Stack spacing={3}>
                    <Stack>
                      <Tags tags={group.tags} />
                      <Heading className='heading mb-2'>{group.name}</Heading>
                    </Stack>
                    <Stack spacing={2}>
                      <IconText
                        icon={RiBaseStationFill}
                        iconClassName='text-green-500'
                        textClassName='uppercase text-green-500 tracking-wider font-bold'
                      >
                        ONLINE ONLY
                      </IconText>
                      <IconText
                        icon={FaMapMarkerAlt}
                        iconClassName='text-red-700'
                      >{`${group.county && `${group.county}, `} ${
                        group.state
                      }`}</IconText>
                      <IconText
                        icon={MdPeopleAlt}
                        iconClassName='text-blue-400'
                      >
                        {`${numberOfMembers} members`}
                      </IconText>
                      <IconText
                        icon={BsPersonRaisedHand}
                        iconClassName='text-gray-500'
                      >
                        Organised by {processedAdmins}
                      </IconText>
                    </Stack>
                    <Button
                      rounded={"md"}
                      className='bg-black text-white hover:text-black w-full mt-4'
                    >
                      Join Group
                    </Button>
                  </Stack>
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>
          <Flex className='flex-col gap-4'>
            <p className='text-heading5'>Description</p>
            <Text
              noOfLines={linesCount}
              textOverflow={"ellipsis"}
              width={`${width > minWidth ? width + 50 : minWidth + 25}%`}
              transition={"width 0.25s ease"}
              ref={descriptionRef}
            >
              {group.description}
            </Text>
          </Flex>
        </Stack>

        {/* <SimpleGrid columns={[1, 1, 2]} spacing={12}>
            <Image
              src={group.displayPhoto}
              alt={group.name}
              borderRadius='lg'
              className='w-full object-cover h-96'
            />
            <Stack spacing={5}>
              <Stack>
                <Tags tags={group.tags} />
                <Heading className='heading mb-2'>{group.name}</Heading>
              </Stack>
              <Stack spacing={2}>
                <IconText
                  icon={RiBaseStationFill}
                  iconClassName='text-green-500'
                  textClassName='uppercase text-green-500 tracking-wider font-bold'
                >
                  ONLINE ONLY
                </IconText>
                <IconText
                  icon={FaMapMarkerAlt}
                  iconClassName='text-red-700'
                >{`${group.county && `${group.county}, `} ${
                  group.state
                }`}</IconText>
                <IconText icon={MdPeopleAlt} iconClassName='text-blue-400'>
                  {`${numberOfMembers} members`}
                </IconText>
                <IconText
                  icon={BsPersonRaisedHand}
                  iconClassName='text-gray-500'
                >
                  Organised by {processedAdmins}
                </IconText>
              </Stack>
              <Text>{group.description}</Text>
              <Button
                rounded={"md"}
                className='bg-black text-white hover:text-black lg:w-1/2 w-full'
              >
                Join Group
              </Button>
            </Stack>
          </SimpleGrid> */}
        <p className='text-heading4'>Events from {params?.groupId}</p>
        <Flex className='flex-col w-[65%]' gap={6}>
          {eventData.map((event, index) => (
            <EventCards
              name={""}
              displayPhoto={""}
              location={""}
              online={false}
              dateTime={null}
              photos={[]}
              materials={[]}
              groupId={params?.groupId}
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
