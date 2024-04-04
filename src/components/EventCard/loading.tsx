import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const EventCardsLoading = () => {
  return (
    <Flex className="flex-col w-[100%] md:w-[65%]" gap={6}>
      <div className="bg-white rounded-xl p-4 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4 w-[100%]">
          <div className="flex flex-col gap-2 w-[100%]">
            <SkeletonText
              mt="4"
              noOfLines={1}
              spacing="4"
              skeletonHeight="4"
              className="w-1/2"
            />
            <Flex className="w-full gap-5">
              <SkeletonText
                mt="4"
                noOfLines={6}
                spacing="4"
                skeletonHeight="3"
                className="w-9/12"
              />
              <Skeleton className="w-3/12 object-cover mt-4" />
            </Flex>
            <Flex className="justify-end">
              <Skeleton className="w-2/12 h-8 mt-4 right-0" />
            </Flex>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4 w-[100%]">
          <div className="flex flex-col gap-2 w-[100%]">
            <SkeletonText
              mt="4"
              noOfLines={1}
              spacing="4"
              skeletonHeight="4"
              className="w-1/2"
            />
            <Flex className="w-full gap-5">
              <SkeletonText
                mt="4"
                noOfLines={6}
                spacing="4"
                skeletonHeight="3"
                className="w-9/12"
              />
              <Skeleton className="w-3/12 object-cover mt-4" />
            </Flex>
            <Flex className="justify-end">
              <Skeleton className="w-2/12 h-8 mt-4 right-0" />
            </Flex>
          </div>
        </div>
      </div>
    </Flex>
  );
};

export default EventCardsLoading;
