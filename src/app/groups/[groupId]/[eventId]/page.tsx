import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <div>
      <div className="flex flex-row gap-4 align-middle">
        <Button>
          <Link href={`/groups/${params?.groupId}`}>Back</Link>
        </Button>
        <p className="text-heading4">
          {params?.groupId}/{params?.eventId}
        </p>
      </div>
    </div>
  );
}
