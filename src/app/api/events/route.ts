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

export async function POST(request: Request) {
  const req = await request.json();
  const {
    name,
    description,
    location,
    online,
    dateTime,
    groupId,
    photos,
    meetingLink,
    userId,
    displayPhoto,
  } = req;
  const parsedDateTime = new Date(dateTime);

  console.log("trying to create event...");
  const eventData = await prisma.event.create({
    data: {
      name,
      description,
      location,
      online,
      dateTime: parsedDateTime,
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
          userId,
        },
      },
      organizers: {
        create: {
          userId,
        },
      },
    },
  });
  console.log("event created", eventData);

  return Response.json(eventData);
}
