import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Carousel from "./components/carousel/carousel";
import { RECOMMENDED_GROUPS } from "./sample/groups";

export default async function Home() {
  return (
    <>
      <Flex className="flex-col gap-4 px-28 mb-4">
        <Box className='h-40'>Map goes here</Box>
        <Carousel groups={RECOMMENDED_GROUPS} />
      </Flex>
    </>
  );
}
