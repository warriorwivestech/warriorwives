import {
  Box,
  Flex,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";

export default function GroupLoading() {
  return (
    <div className='flex flex-col-reverse gap-8 justify-between'>
      <div className='flex flex-col gap-6'>
        <Stack gap={8}>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <Skeleton className='w-full object-cover h-96' />
            <Box>
              <SkeletonText
                mt='4'
                noOfLines={1}
                spacing='4'
                skeletonHeight='10'
              />
              <SkeletonText
                mt='4'
                noOfLines={6}
                spacing='4'
                skeletonHeight='4'
              />
            </Box>
          </SimpleGrid>
          <Flex className='flex-col gap-4'>
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </Flex>
        </Stack>
      </div>
    </div>
  );
}
