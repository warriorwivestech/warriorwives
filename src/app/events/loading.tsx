import { TypographyH3 } from "@/components/ui/typography/h3";
import { Flex, SkeletonText } from "@chakra-ui/react";

export default function EventsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <TypographyH3>My Events</TypographyH3>
      <Flex className="flex-col w-[100%]" gap={6}>
        <div className={"min-w-[340px]"}>
          <div className="bg-white rounded-xl p-4 flex flex-col gap-6 shadow">
            <div className="flex flex-row justify-between gap-4 w-[100%]">
              <div className="flex flex-col gap-2 w-[100%]">
                <SkeletonText
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="4"
                  width={"10%"}
                />

                <SkeletonText
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="6"
                  width={"30%"}
                />

                <SkeletonText
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="4"
                  width={"10%"}
                />
              </div>

              <div className="w-[100%] max-w-[200px]">
                <SkeletonText
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="130px"
                  width={"100%"}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <SkeletonText
                  noOfLines={3}
                  spacing="4"
                  skeletonHeight="4"
                  width={"50%"}
                />
              </div>

              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2">
                  <SkeletonText
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="4"
                    width={"10%"}
                  />
                </div>
                <SkeletonText
                  noOfLines={1}
                  spacing="4"
                  skeletonHeight="8"
                  width={"5%"}
                />
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </div>
  );
}
