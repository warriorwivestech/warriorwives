"use client";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";

export default function UnauthenticatedNavBar() {
  return (
    <div>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center" }}
          alignItems={"center"}
        >
          <Box as="a" href="/">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
          </Box>
        </Flex>
      </Flex>
    </div>
  );
}
