"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, Flex, Tag, Text, Badge, Button, Card } from "@chakra-ui/react";
import { GroupTypes } from "@/types/groups";
import useEmblaCarousel from "embla-carousel-react";
import { StarIcon } from "@chakra-ui/icons";

export default function Carousel({ groups }: { groups: GroupTypes[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [scrollProgress, setScrollProgress] = useState(1);

  const onScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  useEffect(() => {
    if (!embla) return;
    onScroll();
    embla.on("scroll", onScroll);
  }, [embla, onScroll]);

  return (
    <Flex className="flex-col gap-2">
      <p className="flex gap-2 items-center text-heading5">
        <StarIcon boxSize={3} />
        Recommended Troops
      </p>
      <Card overflow={"hidden"} ref={emblaRef}>
        <Flex h={"30rem"}>
          {groups.map((group) => (
            <Box
              key={group.id}
              className="flex-[0_0_100%] min-w-0 bg-center bg-no-repeat bg-cover"
              bgImage={`url(${group.background})`}
            >
              <Box className="absolute w-full h-full bg-gray-800 opacity-70" />
              <Box className="px-24 py-14 relative z-10">
                <Box className="py-4">
                  {group.isOnline && (
                    <Tag className="mr-4" colorScheme="blue">
                      Online Only
                    </Tag>
                  )}
                  <Tag colorScheme="orange">{group.name}</Tag>
                </Box>
                <Text className="font-bold text-5xl text-white">{`${group.name} Warrior Wives of ${group.location}`}</Text>
                <Text className="font-semibold text-gray-200">{`${group.location}`}</Text>
                {group.tags.map((tag) => (
                  <Badge
                    key={tag.name}
                    className="mr-2"
                    colorScheme={tag.colour}
                  >
                    {tag.name}
                  </Badge>
                ))}
                <Text className="text-white mt-4">{`${group.description}`}</Text>
                <Box className="mt-4" as={"a"} href={`/groups/${group.id}`}>
                  <Button className="mt-4 bg-slate-200" size="sm">
                    View Troop
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
        {/* <Flex className='justify-center items-center'>
        <Flex className='relative bg-gray-200 gap-2 justify-center items-center overflow-hidden'>
          <Box
            className='absolute bg-black w-full top-0 bottom-0 left-[-100%] z-0'
            style={{ transform: `translateX(${scrollProgress + 20}%)` }}
          />
          {groups.map((_) => (
            <Box className='rounded-full bg-white w-2 h-2 z-10' />
          ))}
        </Flex>
      </Flex> */}
      </Card>
      <Flex className="justify-center mt-2">
        <Box className="h-4 max-w-xl relative rounded-sm w-72 bg-gray-200 overflow-hidden">
          <Box
            className="absolute bg-cyan-300 w-full top-0 bottom-0 left-[-100%]"
            style={{ transform: `translateX(${scrollProgress}%)` }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
