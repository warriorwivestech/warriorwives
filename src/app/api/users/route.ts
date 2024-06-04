import { auth } from "@/auth";
import { parseBranchOfService } from "@/data/helpers";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";

async function queryUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      branch: true,
      superUser: true,
      facebook: true,
      twitter: true,
      instagram: true,
      linkedin: true,
      sheerIdVerified: true,
      manualVerified: true,
      _count: {
        select: {
          interests: true,
          groups: true,
          eventsJoined: true,
          eventsOrganized: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

type UnparsedUsers = Prisma.PromiseReturnType<typeof queryUsers>;

function parseVerificationStatus(user: UnparsedUsers[0]) {
  if (user.manualVerified) {
    return "verified";
  }
  if (user.sheerIdVerified) {
    return "manualVerificationRemoved";
  }
  return "pendingSheerIdVerification";
}

function parseUsers(users: UnparsedUsers) {
  return users.map((user) => {
    return {
      ...user,
      branch: parseBranchOfService(user.branch),
      interestsCount: user._count.interests,
      groupsCount: user._count.groups,
      eventsJoinedCount: user._count.eventsJoined,
      eventsOrganizedCount: user._count.eventsOrganized,
      verificationStatus: parseVerificationStatus(user),
    };
  });
}

export type AllUsersDataType = ReturnType<typeof parseUsers>;

export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const currentUserEmail = user.email as string;
  const userIsSuperUser = await queryUserIsSuperUser(currentUserEmail);
  if (!userIsSuperUser) {
    throw new Error("Unauthorized");
  }

  const users = await queryUsers();

  return Response.json(parseUsers(users));
}
