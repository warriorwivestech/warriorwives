import { SimpleGrid, Stack } from "@chakra-ui/react";

export default function GroupLoading() {
  return (
    <div>Loading...</div>
    // <div className="flex flex-col-reverse md:flex-row gap-8 justify-between">
    //   <div className="flex flex-col gap-6">
    //     <Stack gap={8}>
    //       <SimpleGrid columns={[1, 1, 2]} spacing={8}>
    //         <Image
    //           src={displayPhotoUrl}
    //           alt={name}
    //           borderRadius="lg"
    //           className="w-full object-cover h-96"
    //         />
    //         <Box
    //           className={`${isSticky ? "bg-white rounded-xl" : ""} p-7`}
    //           position="fixed"
    //           transition={
    //             "width 0.25s ease, border 1s ease, background 0.5s ease, top 0.2s ease"
    //           }
    //           top={!isSticky ? `calc(110px - ${scrollSpeed}px)` : "48px"}
    //           right="48px"
    //           width={`${width > minWidth ? width : minWidth}%`}
    //         >
    //           <Box>
    //             <Stack spacing={3}>
    //               <Stack>
    //                 <Tags tags={tags} />
    //                 <Heading className="heading mb-2">{name}</Heading>
    //               </Stack>
    //               <Stack spacing={2}>
    //                 {online && (
    //                   <IconText
    //                     icon={RiBaseStationFill}
    //                     iconClassName="text-green-500"
    //                     textClassName="uppercase text-green-500 tracking-wider font-bold"
    //                   >
    //                     ONLINE ONLY
    //                   </IconText>
    //                 )}
    //                 <IconText
    //                   icon={FaMapMarkerAlt}
    //                   iconClassName="text-red-700"
    //                 >
    //                   {location}
    //                 </IconText>
    //                 <IconText icon={MdPeopleAlt} iconClassName="text-blue-400">
    //                   {`${membersCount} members`}
    //                 </IconText>
    //                 <IconText
    //                   icon={BsPersonRaisedHand}
    //                   iconClassName="text-gray-500"
    //                 >
    //                   Organised by {parsedAdmins}
    //                 </IconText>
    //               </Stack>
    //               <Button
    //                 rounded={"md"}
    //                 className="bg-black text-white hover:text-black w-full mt-4"
    //               >
    //                 Join Group
    //               </Button>
    //             </Stack>
    //           </Box>
    //         </Box>
    //       </SimpleGrid>
    //       <Flex className="flex-col gap-4">
    //         <p className="text-heading5">Description</p>
    //         <Text
    //           noOfLines={linesCount}
    //           textOverflow={"ellipsis"}
    //           width={`${width > minWidth ? width + 50 : minWidth + 25}%`}
    //           transition={"width 0.25s ease"}
    //           ref={descriptionRef}
    //         >
    //           {description}
    //         </Text>
    //       </Flex>
    //     </Stack>
    //     <p className="text-heading4">Events from {name}</p>
    //     <Flex className="flex-col w-[65%]" gap={6}>
    //       {sampleEventData.map((event, index) => (
    //         <EventCards
    //           name={""}
    //           displayPhoto={""}
    //           location={""}
    //           online={false}
    //           dateTime={null}
    //           photos={[]}
    //           materials={[]}
    //           groupId={String(id)}
    //           key={index}
    //           id={0}
    //           description={""}
    //           group={null}
    //         />
    //       ))}
    //     </Flex>
    //   </div>
    // </div>
  );
}