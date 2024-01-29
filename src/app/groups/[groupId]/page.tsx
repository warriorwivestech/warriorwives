"use client";

import EventCards from "@/app/components/EventCards";
import {
  Button,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function EventsPage({
  params,
}: {
  params: { groupId: string };
}) {
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

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 align-left w-auto">
          <Button
            w={"min-content"}
            leftIcon={<Icon fontSize={16} as={FaChevronLeft} />}
            variant="solid"
          >
            <Link
              href={"/groups"}
              className="flex flex-row gap-2 align-middle justify-center"
            >
              Back{" "}
            </Link>
          </Button>

          <HStack spacing={2}>
            {/* tags */}
            <Tag w={"auto"}>tags</Tag>
            <Tag w={"auto"}>tags</Tag>
          </HStack>
          <p className="text-heading4">Events from {params?.groupId}</p>
        </div>

        {/* group description */}
        <Flex flexDirection="column" gap={2}>
          <Text>
            <span className="font-bold">Description: </span>
            Join us for an open-air screening of classic and contemporary films.
          </Text>

          {/* branchOfService */}
          <Text>
            <span className="font-bold">Branch Of Service: </span>
            testing data
          </Text>

          {/* number of members */}
          <Text>
            <span className="font-bold">Number of members: </span>
            testing data
          </Text>

          {/* location */}
          <Text>
            <span className="font-bold">Location: </span>
            testing data
          </Text>
        </Flex>
        <SimpleGrid columns={[1, 1, 2]} spacing={4}>
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
        </SimpleGrid>
      </div>
    </div>
  );
}
