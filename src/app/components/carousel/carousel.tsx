"use client";

import React, { useState, useCallback } from "react";
import { Box, Flex, Tag, Text, Badge, Button } from "@chakra-ui/react";
import { GroupTypes } from "@/app/types/groups";
import useEmblaCarousel from "embla-carousel-react";

export default function Carousel({ groups }: { groups: GroupTypes[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <Box overflow={"hidden"} ref={emblaRef}>
      <Flex h={"30rem"}>
        {groups.map((group) => (
          <Box
            className='flex-[0_0_100%] min-w-0 bg-center bg-no-repeat bg-cover'
            bgImage={`url(${group.background})`}
          >
            <Box className='absolute w-full h-full bg-gray-800 opacity-70' />
            <Box className='px-24 py-14 relative z-10'>
              {group.isOnline && (
                <Tag className='mr-4' colorScheme='blue'>
                  Online Only
                </Tag>
              )}
              <Tag colorScheme='orange'>{group.name}</Tag>
              <Text className='font-bold text-5xl text-white'>{`${group.name} Warrior Wives of ${group.location}`}</Text>
              <Text className='font-semibold text-gray-200'>{`${group.location}`}</Text>
              {group.tags.map((tag) => (
                <Badge className='mr-2' colorScheme={tag.colour}>
                  {tag.name}
                </Badge>
              ))}
              <Text className='text-white mt-4'>{`${group.description}`}</Text>
              <Box className='mt-4' as={"a"} href={`/groups/${group.id}`}>
                <Button className='mt-4 bg-slate-200' size='sm'>
                  View Group
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
