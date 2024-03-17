import React from "react";
import { Divider, Flex } from "@chakra-ui/react";
import Map from "./components/Map";
import Search from "./components/Search";

export default async function Home() {
  const emojis = [
    "💪",
    "✨",
    "🤘",
    "⚔️",
    "🪖",
    "🧗‍♀️",
    "🏌️",
    "🏋️‍♀️",
    "🚴‍♀️",
    "🏄‍♀️",
    "🏃‍♀️",
    "🧘‍♀️",
  ];

  return (
    <>
      <Flex className='flex-col gap-10 mb-4'>
        <p className='text-heading2'>
          Welcome back to WarriorWives!{" "}
          {emojis[Math.round(Math.random() * emojis.length)]}
        </p>
        <Divider />
        <Search />
        <Divider />
        <Map />
        {/* <Carousel groups={RECOMMENDED_GROUPS} /> */}
      </Flex>
    </>
  );
}
