import { auth } from "@/auth";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import { queryMemberJoined } from "../../../helpers";
import prisma from "@/prisma";
import { sendNewEventEmail } from "@/resend";

function queryEventAttendeesAndOrganizers(eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      group: {
        select: {
          name: true,
        },
      },
      attendees: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      organizers: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function PUT(
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

  const event = await queryEventAttendeesAndOrganizers(Number(params.eventId));
  if (!event) {
    return Response.json(
      { data: null, error: "Event not found" },
      { status: 404 }
    );
  }
  if (event.sendEmailStatus !== "NOT_QUEUED") {
    return Response.json(
      { data: null, error: "Email already sent" },
      { status: 400 }
    );
  }

  const attendees = event.attendees.map((attendee) => {
    return {
      name: attendee.user.name as string,
      email: attendee.user.email as string,
    };
  });
  const organizers = event.organizers.map((organizer) => {
    return {
      name: organizer.user.name as string,
      email: organizer.user.email as string,
    };
  });

  sendNewEventEmail([...attendees, ...organizers], event, event.group.name);

  await prisma.event.update({
    where: {
      id: Number(params.eventId),
      groupId,
    },
    data: {
      sendEmailStatus: "QUEUED",
    },
  });

  return Response.json({ data: { success: true } });
}

export type NotifyMembersResponseType = {
  data: { success: boolean } | null;
  error: string | null;
};
