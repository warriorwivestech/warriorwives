import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import {
  parseBranchOfService,
  parseReverseBranchOfService,
} from "@/data/helpers";
import { ProfileFormValues } from "@/app/profile/components/ProfileForm";

async function queryUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
    include: {
      interests: {
        include: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
type UnparsedUser = Prisma.PromiseReturnType<typeof queryUser>;
type UserType = NonNullable<UnparsedUser>;

function parseUser(user: UserType) {
  return {
    ...user,
    branch: parseBranchOfService(user.branch),
    interests: user.interests.map((interest) => {
      return {
        id: interest.interest.id,
        name: interest.interest.name,
      };
    }),
  };
}

export type UserDataType = ReturnType<typeof parseUser>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const queriedUser = await queryUser();
  if (!queriedUser) {
    throw new Error("User not found");
  }

  const parsedData = parseUser(queriedUser);

  return Response.json(parsedData);
}

export async function PUT(request: Request) {
  const body: ProfileFormValues = await request.json();

  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { name, branch, email, interests } = body;
  const parsedBranch = parseReverseBranchOfService(branch, false) as
    | "ARMY"
    | "NAVY"
    | "AIR_FORCE"
    | "COAST_GUARD"
    | "MARINE_CORPS"
    | "SPACE_FORCE";

  const newInterests = interests
    ? interests.map((interest) => {
        return { id: interest.id };
      })
    : [];
  const usersCurrentInterests = await prisma.interestsOnUsers.findMany({
    where: {
      user: {
        email: user.email as string,
      },
    },
  });

  const interestsToDelete = usersCurrentInterests.filter((interest) => {
    return !newInterests.some(
      (newInterest) => newInterest.id === interest.interestId
    );
  });
  const interestsToAdd = newInterests.filter((interest) => {
    return !usersCurrentInterests.some(
      (currentInterest) => currentInterest.interestId === interest.id
    );
  });

  const updatedUser = await prisma.user.update({
    where: {
      email: user.email as string,
    },
    data: {
      name,
      branch: parsedBranch,
      email,
      interests: {
        deleteMany: interestsToDelete,
        create: [
          ...interestsToAdd.map((interest) => {
            return {
              interestId: interest.id,
            };
          }),
        ],
      },
    },
  });

  return Response.json(updatedUser);
}
