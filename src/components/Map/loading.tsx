import {
  Card,
  CardBody,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

export default function MapLoading() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <SkeletonText noOfLines={1} skeletonHeight="3" width="25%" />
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          <Card className="w-[100%] h-[100%] bg-white">
            <CardBody className="bg-white rounded">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </CardBody>
          </Card>
          <Card className="w-[100%] h-[100%] bg-white">
            <CardBody className="bg-white rounded">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </CardBody>
          </Card>
          <Card className="w-[100%] h-[100%] bg-white">
            <CardBody className="bg-white rounded">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </CardBody>
          </Card>
        </SimpleGrid>
      </div>
    </div>
  );
}
