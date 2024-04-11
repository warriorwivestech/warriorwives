// name         String
//   description  String
//   displayPhoto String?
//   location     String?
//   online       Boolean              @default(false)
//   dateTime     DateTime
//   group        Group                @relation(fields: [groupId], references: [id])
//   groupId      Int
//   photos       EventPhoto[]
//   materials    EventMaterial[]
//   meetingLink  String?
//   attendees    AttendeesOnEvents[]
//   organizers   OrganizersOnEvents[]

import prisma from "@/prisma";
import { Event } from "./[eventId]/route";

export async function POST(request: Request) {
  const req: Event = await request.json();
  const {
    name,
    description,
    location,
    online,
    startDateTime,
    endDateTime,
    groupId,
    photos,
    meetingLink,
    userId,
    displayPhoto,
  } = req;
  const parsedStartDateTime = new Date(startDateTime);
  const parsedEndDateTime = new Date(endDateTime);

  console.log("trying to create event...");
  const eventData = await prisma.event.create({
    data: {
      name,
      description,
      location,
      online,
      dateTime: parsedStartDateTime as any,
      // startDateTime: parsedStartDateTime as any,
      // endDateTime: parsedEndDateTime as any,
      groupId,
      meetingLink,
      displayPhoto,
      photos: {
        create: photos.map((photo: string) => {
          return {
            photo,
          };
        }),
      },
      attendees: {
        create: {
          userId: userId as number,
        },
      },
      organizers: {
        create: {
          userId: userId as number,
        },
      },
    },
  });
  console.log("event created", eventData);

  return Response.json(eventData);
}
