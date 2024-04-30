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
          members: {
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

  const members = event.group.members.map((member) => {
    return {
      email: member.user.email as string,
      name: member.user.name as string,
    };
  });

  sendNewEventEmail(members, event, event.group.name);

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
