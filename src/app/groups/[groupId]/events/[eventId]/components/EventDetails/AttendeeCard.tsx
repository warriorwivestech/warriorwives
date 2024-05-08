import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface AttendeeCardProps {
  id: number;
  src: string;
  alt: string;
  name: string;
  role: string;
}

function AttendeeCard({ id, src, alt, name, role }: AttendeeCardProps) {
  return (
    <Link href={`/members/${id}`}>
      <Card className="p-4 text-center flex flex-col items-center gap-4 h-56 w-40 hover:shadow-lg transition-shadow">
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
    </Link>
  );
}

export default AttendeeCard;
