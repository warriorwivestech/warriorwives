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
import { sendNewEventEmail } from "@/resend";

async function queryGroupNameAndMembers(groupId: number) {
  const groupData = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      name: true,
      members: true,
    },
  });

  return { groupName: groupData?.name, members: groupData?.members };
}

async function queryUserEmail(userId: number) {
  const userData = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  return userData?.email;
}


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

  const event = {
    name,
    description,
    location,
    online,
    startDateTime: parsedStartDateTime as any,
    endDateTime: parsedEndDateTime as any,
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
  };
  const eventData = await prisma.event.create({ data: event });
  console.log("event created", eventData);

  const { groupName, members } = await queryGroupNameAndMembers(groupId);
  if (members) {
    const emails: string[] = [];
    for (const member of members) {
      const email = await queryUserEmail(member.userId);
      email && emails.push(email);
    }
    if (emails.length) {
      const error = sendNewEventEmail(emails, groupId, groupName ?? "", eventData.id, eventData.name);
      if (error) {
        return Response.json({ eventData, error: error });
      }
      console.log("successfully sent emails");
    }
  }

  return Response.json(eventData);
}
