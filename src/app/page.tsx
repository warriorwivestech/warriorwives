import React, { useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Carousel from "./components/Carousel/carousel";
import { RECOMMENDED_GROUPS } from "./sample/groups";
import Map from "./components/Map";

export default async function Home() {
  return (
    <>
      <Flex className='flex-col gap-4 px-28 mb-4'>
        <p className='text-heading4'>Groups for you</p>
        <Carousel groups={RECOMMENDED_GROUPS} />
        <Map />
      </Flex>
    </>
  );
}
