import React from "react";
import { Box, Divider, Flex, Heading, Input } from "@chakra-ui/react";
import Carousel from "./components/Carousel/carousel";
import { RECOMMENDED_GROUPS } from "./sample/groups";
import Map from "./components/Map";

export default async function Home() {
  return (
    <>
      <Flex className='flex-col gap-10 px-28 mb-4'>
        <Input className='w-full' placeholder='Search for groups...' />
        <Divider />
        <Carousel groups={RECOMMENDED_GROUPS} />
        <Divider />
        <Map />
      </Flex>
    </>
  );
}
