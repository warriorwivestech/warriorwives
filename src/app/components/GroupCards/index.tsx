import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";

interface GroupCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function GroupCard({
  id,
  title,
  description,
  imageUrl,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <Card className="w-[100%] h-[100%] transition-all duration-300 ease-in-out hover:scale-105">
        <CardBody>
          <Image src={imageUrl} alt={title} borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Heading size="md">{title}</Heading>
            <Text>{description}</Text>
          </Stack>
        </CardBody>
        {/* <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
          <Button className="bg-primary">
            <Link href={`/groups/${id}`}>View events</Link>
          </Button>
        </ButtonGroup>
        </CardFooter> */}
      </Card>
    </Link>
  );
}
