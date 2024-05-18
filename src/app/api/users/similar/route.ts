import { auth } from "@/auth";
import { parseBranchOfService } from "@/data/helpers";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";

async function querySimilarUsers(email: string) {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      branch: true,
      interests: {
        select: {
          interestId: true,
        },
      },
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return await prisma.user.findMany({
    where: {
      id: {
        not: userData.id,
      },
      sheerIdVerified: true,
      manualVerified: true,
      OR: [
        {
          interests: {
            some: {
              interestId: {
                in: userData.interests.map((interest) => interest.interestId),
              },
            },
          },
        },
        {
          branch: userData.branch,
        },
      ],
    },
    include: {
      interests: {
        select: {
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

type UnparsedSimilarUsers = Prisma.PromiseReturnType<typeof querySimilarUsers>;

function parseSimilarUsers(users: UnparsedSimilarUsers) {
  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      image: user.image,
      about: user.about,
      branch: parseBranchOfService(user.branch),
      interests: user.interests.map((interest) => {
        return {
          id: interest.interest.id,
          name: interest.interest.name,
        };
      }),
    };
  });
}

export type SimilarUsersDataType = ReturnType<typeof parseSimilarUsers>;

// find other users based on user interests
export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // get users by interest and exclude user
  const similarUsers = await querySimilarUsers(user.email as string);

  return Response.json(parseSimilarUsers(similarUsers));
}
