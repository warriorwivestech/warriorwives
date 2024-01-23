"use client";

import EventDetails from "@/app/components/EventDetails";
import { Button, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <div>
      <div className="flex flex-col align-left w-auto">
        <Button
          w={"min-content"}
          leftIcon={<Icon fontSize={16} as={FaChevronLeft} />}
          variant="solid"
        >
          <Link
            href={`/groups/${params?.groupId}`}
            className="flex flex-row gap-2 align-middle justify-center"
          >
            Back{" "}
          </Link>
        </Button>
      </div>
      <EventDetails />
    </div>
  );
}
