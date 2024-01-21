import React from "react";
import GroupCard from "../components/GroupCards";
import { SimpleGrid } from "@chakra-ui/react";

export default function GroupPage() {
  const sampleGroupData = [
    {
      id: "1",
      title: "Beach Clean-Up",
      description:
        "Join us for a community beach clean-up and make a difference!",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Join Event",
    },
    {
      id: "2",
      title: "Local Art Exhibition",
      description:
        "Explore stunning artworks by local artists in our vibrant art exhibition.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "View Details",
    },
    {
      id: "3",
      title: "Charity Fun Run",
      description:
        "Participate in our 5k fun run to raise funds for a noble cause.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Register Now",
    },
    {
      id: "4",
      title: "Outdoor Yoga Session",
      description:
        "Experience tranquility and mindfulness with our outdoor yoga classes.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Join Session",
    },
    {
      id: "5",
      title: "Tech Networking Event",
      description:
        "Connect with fellow tech enthusiasts and industry leaders at our networking event.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Sign Up",
    },
    {
      id: "6",
      title: "Cooking Workshop",
      description:
        "Learn new culinary skills in our interactive cooking workshop.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Enroll Today",
    },
    {
      id: "7",
      title: "Book Club Meetup",
      description:
        "Join our monthly book club meeting to discuss this month's chosen book.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Attend Meetup",
    },
    {
      id: "8",
      title: "Live Jazz Night",
      description: "Enjoy an evening of live jazz music at our local café.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Reserve Seats",
    },
    {
      id: "9",
      title: "Community Gardening",
      description:
        "Get your hands dirty and help beautify our community garden.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Volunteer",
    },
    {
      id: "10",
      title: "Film Screening Under the Stars",
      description:
        "Join us for an open-air screening of classic and contemporary films.",
      imageUrl:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      buttonText: "Buy Tickets",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <p className="text-heading3">Groups you might be interested in</p>
        <div className="flex flex-row gap-8 overflow-scroll overflow-y-hidden">
          {sampleGroupData.map((group, index) => {
            return (
              <div key={index} className="min-w-[330px] sm:min-w-[500px] mb-4">
                <GroupCard {...group} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-heading4">Explore more groups</p>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
          {sampleGroupData.map((group, index) => {
            return <GroupCard key={index} {...group} />;
          })}
        </SimpleGrid>
      </div>
    </div>
  );
}
