import { TypographyH3 } from "@/components/ui/typography/h3";
import {
  Card,
  CardBody,
  Flex,
  SimpleGrid,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

export default function GroupLoading() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <TypographyH3>My Troops</TypographyH3>
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="w-full h-full bg-white">
              <CardBody className="bg-white rounded">
                <Flex className="justify-between">
                  <SkeletonText
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="4"
                    width={"25%"}
                  />
                  <SkeletonText
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="4"
                    width={"25%"}
                  />
                </Flex>
                <Skeleton className="w-full object-cover h-64 mt-4" />
                <SkeletonText
                  mt="4"
                  noOfLines={4}
                  spacing="4"
                  skeletonHeight="2"
                />
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}
