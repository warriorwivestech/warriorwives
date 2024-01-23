"use client";

import React from "react";
import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Image,
  Tag,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

interface GroupCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function GroupCard({
  id,
  title,
  description,
  imageUrl,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <Card className="w-[100%] h-[100%] transition-all duration-300 ease-in-out hover:scale-105">
        <CardBody>
          {/* displayPhoto */}
          <Image src={imageUrl} alt={title} borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Flex flexDirection="row" justifyContent="space-between">
              <HStack spacing={2}>
                {/* tags */}
                <Tag w={"auto"}>tags</Tag>
                <Tag w={"auto"}>tags</Tag>
              </HStack>
              <Flex justifyContent="center" gap={2} alignItems="center">
                <Icon as={FaMapMarkerAlt} />
                <Text color="gray.500">Mexico</Text>
              </Flex>
            </Flex>
            {/* name */}
            <Heading size="md">{title}</Heading>
            {/* description */}
            <Text>{description}</Text>
          </Stack>
        </CardBody>
        {/* <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
          <Button className="bg-primary">
            <Link href={`/groups/${id}`}>View events</Link>
          </Button>
        </ButtonGroup>
        </CardFooter> */}
      </Card>
    </Link>
  );
}
