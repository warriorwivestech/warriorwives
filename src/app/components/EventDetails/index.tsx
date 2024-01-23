"use client";

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";

// Define the props interface
interface EventDetailsProps {
  title: string;
  location: string;
  timing: string;
  description: string;
  materials: string[];
  images: string[];
  eventType: string;
}

export default function EventDetails(props: EventDetailsProps) {
  const { title, location, timing, description, materials, images, eventType } =
    props;
  return (
    <Container maxW={"auto"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 4, md: 8 }}
      >
        <Flex flexDirection="column" gap={8}>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={
              "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
            }
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
          <Image
            rounded={"md"}
            alt={"product image"}
            src={
              "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
            }
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "200px", lg: "300px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {title}
            </Heading>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"2xl"}
            >
              {location} - <span className="">Physical</span>
            </Text>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"xl"}
            >
              {timing}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <VStack
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Description
              </Text>
              <Text fontSize={"lg"} textAlign="left">
                {description}
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Materials
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  {materials?.map((material, index) => (
                    <ListItem key={index}>{material}</ListItem>
                  ))}
                </List>
              </SimpleGrid>
            </Box>
          </Stack>

          <Button
            w={"full"}
            mt={4}
            size={"lg"}
            className="bg-black text-white hover:text-black"
          >
            Join Event
          </Button>

          <Stack
            direction="column"
            alignItems="center"
            justifyContent={"center"}
          >
            <Text>{eventType}</Text>
            <Text>
              Please ensure that you are able to attend this event upon joining
              it.
            </Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
