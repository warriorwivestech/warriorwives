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
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { RiBaseStationLine } from "react-icons/ri";
import Tags from "../common/tags";
import IconText from "../common/icontext";
import { preload } from "swr";
import { fetcher } from "@/app/providers/swrProvider";

interface GroupCardProps {
  id: number;
  name: string;
  description: string;
  displayPhoto: string;
  branchOfService: string;
  county: string | null;
  state: string;
  online: boolean;
  tags: string[];
  admin?: boolean;
}

export default function GroupCard({
  id,
  name,
  description,
  displayPhoto,
  branchOfService,
  county,
  state,
  online,
  tags,
  admin = false,
}: GroupCardProps) {
  const displayPhotoUrl =
    displayPhoto || "https://startup.mp.gov.in/assets/img/img-not-found.png";
  const location = county ? `${county}, ${state}` : state;
  const parsedBranchOfService =
    branchOfService === "Any" ? "All Branches" : branchOfService;

  return (
    <Link
      href={`/groups/${id}`}
      onMouseEnter={() => {
        preload([`/groups/${id}`], fetcher);
      }}
    >
      <Card className="w-[100%] h-[100%] transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-lg">
        <CardBody>
          <HStack justifyContent={"space-between"} marginBottom="0.75rem">
            <span>
              <Badge
                w={"auto"}
                className="px-[4px] py-[2px] rounded-sm"
                colorScheme="gray"
              >
                {parsedBranchOfService}
              </Badge>
            </span>
            <IconText
              icon={FaMapMarkerAlt}
              iconClassName="!text-red-700"
              textClassName="whitespace-nowrap font-semibold"
            >
              {location}
            </IconText>
          </HStack>
          <Image
            src={displayPhotoUrl}
            alt={name}
            borderRadius="lg"
            className="w-full object-cover h-60"
          />
          <Stack mt="6" spacing="3">
            <Flex flexDirection="row" justifyContent="space-between">
              <Tags tags={tags} />
              {online && (
                <Popover trigger="hover" placement="top">
                  <PopoverTrigger>
                    <div>
                      <RiBaseStationLine className="text-[1.5rem] text-green-500 mr-2 ml-2" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={2}
                      >
                        <InfoOutlineIcon />
                        This group is conducted online.
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </Flex>
            {/* name */}
            <Heading size="md">{name}</Heading>
            <Flex textOverflow="ellipsis" noOfLines={5}>
              <Text>{description}</Text>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
}
