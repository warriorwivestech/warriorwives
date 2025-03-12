import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";

export async function queryUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  try {
    const userData = await prisma.user.findUnique({
      where: {
        email: user.email as string,
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

    return userData;
  } catch (error) {
    console.error("Error querying user:", error);
    return null;
  }
}

export type UnparsedUserData = Prisma.PromiseReturnType<typeof queryUser>;
export type UserType = NonNullable<UnparsedUserData>;

function parseUserData(user: UserType) {
  return {
    ...user,
    branchOfService: parseBranchOfService(user?.branch),
    interests: user.interests.map((interest) => interest.interest.name),
  };
}

export type UserDataType = ReturnType<typeof parseUserData>;

export async function getUser() {
  let data: UserDataType | undefined = undefined;
  let error = undefined;

  try {
    const userData = await queryUser();
    if (!userData) {
      return { data, error };
    }
    data = parseUserData(userData);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    error = {
      message: errorMessage,
      isOfflineError: false, // Removed offline error detection
    };
    console.warn("Error fetching user data:", e);
  }

  return { data, error };
}

// Get user by ID
export async function getUserById(userId: number) {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: {
          include: {
            interest: true,
          },
        },
      },
    });
    return userData;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

// Get user's groups
export async function getUserGroups(userId: number) {
  try {
    const groups = await prisma.membersOnGroups.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            tags: {
              include: {
                interest: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });
    return groups;
  } catch (error) {
    console.error("Error getting user groups:", error);
    return [];
  }
}
