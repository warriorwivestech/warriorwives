import React from "react";
import { Card } from "../../../../../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../../../components/ui/avatar";

interface AttendeeCardProps {
  src: string;
  alt: string;
  name: string;
  role: string;
}

function AttendeeCard({ src, alt, name, role }: AttendeeCardProps) {
  return (
    <Card className="p-4 text-center flex flex-col items-center gap-4 h-56 w-40">
      <Avatar className="w-24 h-24">
        <AvatarImage src={src} alt={alt} />
        {/* first initials of first two name */}
        <AvatarFallback>
          {name
            ?.split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <p className="font-semibold text-sm flex-grow">{name}</p>
      <p className="text-gray-500 text-sm">{role}</p>
    </Card>
  );
}

export default AttendeeCard;
