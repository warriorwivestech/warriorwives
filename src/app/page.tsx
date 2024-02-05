import React from "react";
import { Box, Divider, Flex, Heading, Input } from "@chakra-ui/react";
import Carousel from "./components/carousel/carousel";
import { RECOMMENDED_GROUPS } from "./sample/groups";
import Map from "./components/Map";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <Flex className='flex-col gap-10 mb-4'>
        <Input className='w-full' placeholder='Search for groups...' />
        <Divider />
        <Carousel groups={RECOMMENDED_GROUPS} />
        <Divider />
        <Map />
      </Flex>
    </>
  );
}
