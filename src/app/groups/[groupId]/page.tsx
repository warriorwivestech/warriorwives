import EventCards from "@/app/components/EventCards";
import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

export default function EventsPage({
  params,
}: {
  params: { groupId: string };
}) {
  const eventData = Array.from({ length: 10 }, (_, index) => ({
    id: `${index}`,
    group: `${params?.groupId}`,
    title: `Event Title ${index + 1}`,
    description: "This is a sample description for the event.",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: `Feb ${index + 1}, 2024`,
    readTime: `${index + 1}min read`,
    author: `Author Name ${index + 1}`,
    authorImageUrl: "https://avatars0.githubusercontent.com/u/1164541?v=4",
  }));

  return (
    <div>
      <div className="flex flex-col gap-6">
        <p className="text-heading4">Events from {params?.groupId}</p>
        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {eventData.map((event, index) => (
            <EventCards key={index} {...event} />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}
