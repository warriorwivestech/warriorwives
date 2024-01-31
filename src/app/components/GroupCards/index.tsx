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
} from "@chakra-ui/react";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { RiBaseStationLine } from "react-icons/ri";

interface GroupCardProps {
  id: number;
  name: string;
  description: string;
  displayPhoto: string;
  branchOfService: string;
  county: string;
  state: string;
  online: boolean;
  tags: string[];
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
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <Card className='w-[100%] h-[100%] transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-lg'>
        <CardBody>
          <HStack justifyContent={"space-between"} marginBottom='0.75rem'>
            <Text>{branchOfService}</Text>
            <Flex justifyContent='center' gap={2} alignItems='center'>
              <Icon as={FaMapMarkerAlt} className="text-red-700" />
              <Text className='whitespace-nowrap text-slate-600 font-semibold'>{`${
                county && `${county}, `
              } ${state}`}</Text>
            </Flex>
          </HStack>
          <Image
            src={displayPhoto}
            alt={name}
            borderRadius='lg'
            className='w-full object-cover h-60'
          />
          <Stack mt='6' spacing='3'>
            <Flex flexDirection='row' justifyContent='space-between'>
              <HStack spacing={2} className='flex-wrap'>
                {tags.map((tag) => (
                  <Tag w={"auto"} className='whitespace-nowrap'>
                    {tag}
                  </Tag>
                ))}
              </HStack>
              {online && (
                <Popover trigger='hover' placement='top'>
                  <PopoverTrigger>
                    <div>
                      <RiBaseStationLine className='text-[1.5rem] text-green-500 mr-2 ml-2' />
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
            <Heading size='md'>{name}</Heading>
            {/* description */}
            <Flex textOverflow='ellipsis' noOfLines={5}>
              <Text>{description}</Text>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
}
