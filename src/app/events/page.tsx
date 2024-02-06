"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import EventCards from "../components/EventCards";

export const sampleEventData = Array.from({ length: 10 }, (_, index) => ({
  id: `${index}`,
  group: `1`,
  title: `Event Title ${index + 1}`,
  description:
    "This is a sample description for the event. Repeated for emphasis and variation in each event description.",
  imageUrl: `https://source.unsplash.com/random/200x200?sig=${index}`, // Unique image for each event
  date: `Feb ${index + 1}, 2024`,
  readTime: `${index + 1}min read`,
  author: `Author Name ${index + 1}`,
  authorImageUrl: `https://i.pravatar.cc/150?img=${index}`, // Unique author image for each
}));

export default function EventsPage() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <p className="text-heading4">Joined events</p>
        <Flex className="flex-col w-[100%]" gap={6}>
          {sampleEventData.map((event, index) => (
            <EventCards
              name={event?.title}
              displayPhoto={""}
              location={""}
              online={false}
              dateTime={null}
              photos={[]}
              materials={[]}
              groupId={"1"}
              key={index}
              id={0}
              description={""}
              group={null}
            />
          ))}
        </Flex>
      </div>
    </>
  );
}
