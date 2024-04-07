"use client";

import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  const detailsBgColor = useColorModeValue("gray.700", "gray.200");
  const copyrightBgColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box bg="white" color={detailsBgColor}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <ListHeader>Warrior Wives</ListHeader>
            <Box as="a" href={"https://www.usawarriorwives.org/about_us"}>
              About Us
            </Box>
            <Box as="a" href={"https://www.usawarriorwives.org/contact-us"}>
              Contact Us
            </Box>
          </Stack>
          <Stack align={"flex-start"}>
            <Box>
              <Box fontWeight={"semibold"}>Phone:</Box>
              417-319-6780
            </Box>
            <Box>
              <Box fontWeight={"semibold"}>Mailing Address:</Box>
              Warrior Wives 9998 Academic Avenue #1009 Point Lookout, Missouri
              65726-1009
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={copyrightBgColor}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Text>
            © 2024 ReactEnjoyers for Warrior Wives. All rights reserved
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
