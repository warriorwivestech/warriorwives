import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Carousel from "./components/Carousel/carousel";
import { RECOMMENDED_GROUPS } from "./sample/groups";
import Map from "./components/Map/Map";

export default async function Home() {
  return (
    <>
      <Flex className="flex-col gap-4 px-28 mb-4">
        <Map />
        <Carousel groups={RECOMMENDED_GROUPS} />
      </Flex>
    </>
  );
}
