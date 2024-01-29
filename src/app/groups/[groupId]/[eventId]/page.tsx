"use client";

import EventDetails from "@/app/components/EventDetails";
import { Avatar, Button, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaRegClock } from "react-icons/fa";

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col w-[100%]">
        {/* <Button
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
        </Button> */}
        {/* Header */}
        <div className="bg-white py-[24px] w-[100%] absolute left-0 top-[73px]">
          <div className="max-w-[1440px] m-auto flex gap-4 flex-col px-[24px] md:px-[48px]">
            <p className="text-heading4 font-bold">
              Cultivate a Positive Mindset with Positive Psychology
            </p>

            <div className="flex flex-row gap-4">
              <Avatar name="Host" src={""} />
              <div className="flex flex-col">
                <p>Hosted by</p>

                {/* groupname */}
                <p className="font-bold">groupname</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100% pt-[100px]">
        <EventDetails
          name={""}
          description={""}
          displayPhoto={""}
          location={""}
          online={false}
          dateTime={null}
          group={null}
          materials={[]}
          photos={[]}
          groupId={params?.groupId}
          id={0}
        />
      </div>
    </div>
  );
}
