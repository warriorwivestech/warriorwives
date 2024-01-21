// EventCards.tsx
import Image from "next/image";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

interface EventCardProps {
  id: string;
  group: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  readTime: string;
  author: string;
  authorImageUrl: string;
}

export default function EventCards({
  id,
  group,
  title,
  description,
  imageUrl,
  date,
  readTime,
  author,
  authorImageUrl,
}: EventCardProps) {
  return (
    <Link href={`${group}/${id}`}>
      <Center py={6}>
        <Box
          transition="all"
          maxW={"445px"}
          h={"100%"}
          w={"full"}
          rounded={"md"}
          boxShadow={"2xl"}
          p={6}
          overflow={"hidden"}
          cursor={"pointer"}
          className="transition-all duration-300 ease-in-out hover:scale-105"
        >
          <Box
            h={"210px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            <Image src={imageUrl} layout="fill" objectFit="cover" alt={title} />
          </Box>
          <Stack>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Blog
            </Text>
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {title}
            </Heading>
            <Text color={"gray.500"}>{description}</Text>
          </Stack>
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            <Avatar src={authorImageUrl} />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>{author}</Text>
              <Text color={"gray.500"}>
                {date} · {readTime}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
    </Link>
  );
}
