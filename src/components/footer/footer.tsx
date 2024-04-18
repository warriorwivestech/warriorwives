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
    <div className="border-t-[1px]">
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <div className="font-semibold text-sm">Warrior Wives</div>
            <a
              href="https://www.usawarriorwives.org/about_us"
              className="text-sm text-gray-600"
            >
              About Us
            </a>
            <a
              href="https://www.usawarriorwives.org/contact-us"
              className="text-sm text-gray-600"
            >
              Contact Us
            </a>
          </Stack>
          <Stack align={"flex-start"}>
            <Box>
              <div className="font-semibold text-sm">Phone</div>
              <div className="text-sm text-gray-600">417-319-6780</div>
            </Box>
            <Box>
              <div className="font-semibold text-sm">Mailing Address</div>
              <div className="text-sm text-gray-600">
                Warrior Wives 9998 Academic Avenue #1009 Point Lookout,
                <br />
                Missouri 65726-1009
              </div>
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
          <div className="text-sm text-gray-700">
            © 2024 ReactEnjoyers for Warrior Wives. All rights reserved
          </div>
        </Container>
      </Box>
    </div>
  );
}
