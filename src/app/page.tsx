import React from "react";
import { Divider, Flex } from "@chakra-ui/react";
import Map from "../components/Map";
import Search from "../components/Search";
import Intro from "@/components/Intro";

export default async function Home() {
  return (
    <Flex className="flex-col gap-10 mb-4">
      <Intro />
      <Divider />
      <Search />
      <Divider />
      <Map />
    </Flex>
  );
}
