import { auth } from "@/auth";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import { UnauthenticatedError, UnauthorizedError } from "@/lib/errors";
import prisma from "@/prisma";
import { Event, Prisma } from "@prisma/client";
import { supabase } from "@/supabase";
import { UpdateEventFormValues } from "@/components/EventModal/EditEvent";
import { queryMemberJoined } from "../../helpers";
import { sendCancelledEventEmail, sendUpdatedEventEmail } from "@/resend";

async function queryUserAuthorizedToViewGroupEvents(
  groupId: number,
  userEmail: string
) {
  const data = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
    include: {
      members: {
        where: {
          user: {
            email: userEmail,
          },
        },
      },
    },
  });
  const passwordEnabled = data?.passwordEnabled;
  const userHasJoinedGroup = data?.members && data.members.length > 0;
  const userIsAdmin = data?.members?.[0]?.admin;

  // if group is password protected, user must have joined the group to view events
  // if group is not password protected, user can view events
  const authorized = passwordEnabled ? userHasJoinedGroup : true;

  return { authorized, userIsAdmin };
}

function queryEvent(groupId: number, eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
      groupId,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      attendees: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      organizers: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      photos: {
        select: {
          id: true,
          photo: true,
        },
      },
    },
  });
}
type UnparsedEvent = Prisma.PromiseReturnType<typeof queryEvent>;

function parseEvent(
  event: NonNullable<UnparsedEvent>,
  email: string,
  userIsAdmin: boolean | undefined
) {
  const userIsOrganizer = event.organizers.some(
    (organizer) => organizer.user.email === email
  );
  const userIsAttendee = event.attendees.some(
    (attendee) => attendee.user.email === email
  );

  const eventJoined = userIsOrganizer || userIsAttendee;
  const parsedEvent = {
    ...event,
    groupId: event.group.id,
    groupName: event.group.name,
    attendees: event.attendees.map((attendee) => ({
      id: attendee.user.id,
      name: attendee.user.name,
      email: attendee.user.email,
      image: attendee.user.image,
    })),
    organizers: event.organizers.map((organizer) => ({
      id: organizer.user.id,
      name: organizer.user.name,
      email: organizer.user.email,
      image: organizer.user.image,
    })),
    photos: event.photos.map((photo) => ({
      id: photo.id,
      photo: photo.photo,
    })),
    attendeesCount: event.attendees.length,
    organizersCount: event.organizers.length,
    userIsOrganizer,
    userIsAttendee,
    joined: eventJoined,
    userIsAdmin,
  };

  return parsedEvent;
}
export type SingleEventDataType = ReturnType<typeof parseEvent>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const groupId = Number(params.groupId);
  const eventId = Number(params.eventId);

  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json({
      error: "Unauthenticated",
      message: "User not authenticated",
    });
  }

  const email = user.email as string;
  const userData = await queryUserAuthorizedToViewGroupEvents(groupId, email);
  const userIsSuperUser = await queryUserIsSuperUser(email);
  if (!userData.authorized && !userIsSuperUser) {
    return Response.json({
      error: "Unauthorized",
      message: "You need to join the group to view this event.",
    });
  }

  const event = await queryEvent(groupId, eventId);
  if (!event) {
    return Response.json({ data: null });
  }
  const parsedEvent = parseEvent(event, email, userData.userIsAdmin);

  return Response.json({ data: parsedEvent });
}

export type SingleEventResponseType = {
  data: SingleEventDataType | null;
  error?: string;
  message?: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }

  const groupId = Number(params.groupId);
  const [userIsSuperUser, memberData, eventData] = await Promise.all([
    queryUserIsSuperUser(user.email as string),
    queryMemberJoined(groupId, user.email as string),
    queryEvent(groupId, Number(params.eventId)),
  ]);
  const userIsAdmin = memberData?.admin;
  if (!eventData) {
    throw new Error("Event not found");
  }
  if (!userIsSuperUser && !userIsAdmin) {
    throw new UnauthorizedError();
  }

  const {
    displayPhoto: oldDisplayPhoto,
    photos: oldPhotos,
    startDateTime: oldStartDateTime,
    endDateTime: oldEndDateTime,
    location: oldLocation,
    meetingLink: oldMeetingLink,
    online: oldOnline,
  } = eventData;
  const parsedOldPhotos = oldPhotos.map((photo) => photo.photo);
  const body: UpdateEventFormValues = await request.json();
  const {
    displayPhoto,
    name,
    description,
    online,
    meetingLink,
    location,
    startDateTime,
    endDateTime,
    photos,
    resourceUrl,
  } = body;

  const displayPhotoChanged = displayPhoto !== oldDisplayPhoto;
  const photosToCreate = photos.filter(
    (photo) => !parsedOldPhotos.includes(photo)
  );
  const photosToDelete = parsedOldPhotos.filter(
    (photo) => !photos.includes(photo)
  );

  // compare dates, location, meeting link, and online status
  const startDateTimeChanged =
    new Date(startDateTime).getTime() !== oldStartDateTime.getTime();
  const endDateTimeChanged =
    new Date(endDateTime).getTime() !== oldEndDateTime.getTime();
  const onlineChanged = online !== oldOnline;
  const locationChanged = onlineChanged ? false : location !== oldLocation;
  const meetingLinkChanged = onlineChanged
    ? false
    : meetingLink !== oldMeetingLink;
  const eventDataChanged =
    startDateTimeChanged ||
    endDateTimeChanged ||
    locationChanged ||
    meetingLinkChanged ||
    onlineChanged;

  const updatedEventData = await prisma.event.update({
    where: {
      id: Number(params.eventId),
    },
    data: {
      displayPhoto,
      name,
      description,
      online,
      meetingLink,
      location,
      resourceUrl: resourceUrl || "",
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      sendUpdateEmail: eventDataChanged || eventData.sendUpdateEmail,
      photos: {
        create: photosToCreate.map((photo) => {
          return {
            photo: photo,
          };
        }),
        deleteMany: {
          photo: {
            in: photosToDelete,
          },
        },
      },
    },
    include: {
      photos: {
        select: {
          id: true,
          photo: true,
        },
      },
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  if (displayPhotoChanged && oldDisplayPhoto) {
    const fileName = oldDisplayPhoto.split("/event-banners/")[1];
    const key = `group-banners/${fileName}`;
    const { data, error } = await supabase.storage
      .from("warrior-wives-test")
      .remove([key]);
  }

  if (photosToDelete.length > 0) {
    const keys = photosToDelete.map((photo) => {
      const fileName = photo.split("/event-photos/")[1];
      return `event-photos/${fileName}`;
    });
    const { data, error } = await supabase.storage
      .from("warrior-wives-test")
      .remove(keys);
  }

  if (eventDataChanged) {
    setTimeout(() => {
      sendUpdatedEventEmail(updatedEventData, updatedEventData.group.name);
      // send after 5 minutes
    }, 300000);
  }

  return Response.json(updatedEventData);
}

export type UpdateEventResponseType = Event;

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json(
      { data: null, error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const groupId = Number(params.groupId);
  const [userIsSuperUser, memberData] = await Promise.all([
    queryUserIsSuperUser(user.email as string),
    queryMemberJoined(groupId, user.email as string),
  ]);
  const userIsAdmin = memberData?.admin;
  if (!userIsSuperUser && !userIsAdmin) {
    return Response.json(
      { data: null, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const event = await prisma.event.delete({
    where: {
      id: Number(params.eventId),
      groupId,
    },
    include: {
      // displayPhoto: true,
      photos: {
        select: {
          photo: true,
        },
      },
      attendees: {
        select: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
      organizers: {
        select: {
          user: {
            select: {
              email: true,
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
  const { displayPhoto, photos, attendees, organizers } = event;

  try {
    if (displayPhoto) {
      const fileName = displayPhoto.split("/event-banners/")[1];
      const key = `event-banners/${fileName}`;
      const { data, error } = await supabase.storage
        .from("warrior-wives-test")
        .remove([key]);
    }

    if (photos.length > 0) {
      const keys = photos.map((photo) => {
        const fileName = photo.photo.split("/event-photos/")[1];
        return `event-photos/${fileName}`;
      });
      const { data, error } = await supabase.storage
        .from("warrior-wives-test")
        .remove(keys);
    }
  } catch (error) {
    console.error(error);
  }

  const parsedAttendees = attendees.map((attendee) => {
    return {
      name: attendee.user.name as string,
      email: attendee.user.email as string,
    };
  });
  const parsedOrganizers = organizers.map((organizer) => {
    return {
      name: organizer.user.name as string,
      email: organizer.user.email as string,
    };
  });
  sendCancelledEventEmail(
    [...parsedAttendees, ...parsedOrganizers],
    event,
    event.group.name
  );

  return Response.json({ data: { success: true } });
}

export type DeleteEventResponseType = {
  data: { success: boolean } | null;
  error: string | null;
};
