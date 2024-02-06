import {
  Card,
  CardBody,
  Flex,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

export default function RecommendedGroupsLoading() {
  return (
    <div className='flex flex-row gap-8 overflow-scroll overflow-y-hidden'>
      <div className='min-w-[330px] sm:min-w-[500px] mb-4'>
        <Card className='w-[100%] h-[100%] bg-white'>
          <CardBody className='bg-white rounded'>
            <Flex className='justify-between'>
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
            </Flex>
            <Skeleton className='w-full object-cover h-64 mt-4' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </CardBody>
        </Card>
      </div>
      <div className='min-w-[330px] sm:min-w-[500px] mb-4'>
        <Card className='w-[100%] h-[100%] bg-white'>
          <CardBody className='bg-white rounded'>
            <Flex className='justify-between'>
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
            </Flex>
            <Skeleton className='w-full object-cover h-64 mt-4' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </CardBody>
        </Card>
      </div>
      <div className='min-w-[330px] sm:min-w-[500px] mb-4'>
        <Card className='w-[100%] h-[100%] bg-white'>
          <CardBody className='bg-white rounded'>
            <Flex className='justify-between'>
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
              <SkeletonText
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                width={"25%"}
              />
            </Flex>
            <Skeleton className='w-full object-cover h-64 mt-4' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
