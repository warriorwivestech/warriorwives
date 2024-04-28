import { Flex, Card, SkeletonText, CardBody } from "@chakra-ui/react";

export default function EventsLoading() {
  return (
    <>
      <div className="flex flex-col gap-8">
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
          width={"20%"}
        />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[65%]">
            <SkeletonText
              noOfLines={1}
              spacing="4"
              skeletonHeight="500px"
              width={"100%"}
            />
          </div>
          <Card className="lg:w-[30%] h-[200px]">
            <CardBody className="flex flex-col gap-8">
              <SkeletonText
                noOfLines={1}
                spacing="8"
                skeletonHeight="6"
                width={"100%"}
              />
              <SkeletonText
                noOfLines={1}
                spacing="8"
                skeletonHeight="6"
                width={"100%"}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
