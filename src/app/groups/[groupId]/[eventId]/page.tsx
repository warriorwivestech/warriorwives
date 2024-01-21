import React from "react";

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <div>
      {params?.groupId}/{params?.eventId}
    </div>
  );
}
