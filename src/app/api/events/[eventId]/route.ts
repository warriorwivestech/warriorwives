import prisma from "@/prisma";

export type Event = {
  id: number;
  name: string;
  description: string;
  displayPhoto: string | null;
  location: string | null;
  meetingLink: string | null;
  startDateTime: string;
  endDateTime: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
  groupId: number;
  attendees: string[];
  photos: string[];
  organizers: string[];
  joined: boolean;
  groupName: string;
  userId: number | undefined;
};

function parseEventData(eventData: any, memberData: any) {
  const parsedData = {
    ...eventData,
    attendees: eventData.attendees.map((attendee: any) => {
      return attendee.user.name;
    }),
    organizers: eventData.organizers.map((organizer: any) => {
      return organizer.user.name;
    }),
    photos: eventData.photos.map((photo: any) => {
      return photo.photo;
    }),
    joined: memberData ? true : false,
    groupName: eventData.group.name,
  };

  return parsedData;
}

function getEventData(eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      attendees: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      photos: true,
      organizers: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      group: {
        select: {
          name: true,
        },
      },
    },
  });
}

function getAttendeeData(eventId: number, userId: number) {
  return prisma.attendeesOnEvents.findFirst({
    where: {
      eventId,
      userId,
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  // TODO: get userId from session
  const eventId = Number(params.eventId);

  const [eventData, memberData] = await Promise.all([
    getEventData(eventId),
    getAttendeeData(eventId, 3),
  ]);

  const parsedData = eventData
    ? parseEventData(eventData, memberData)
    : eventData;

  return Response.json(parsedData);
}
