import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";
import { safeDbOperation, checkNetworkStatus } from "@/lib/offlineMode";

// Check network status on application load
let networkCheckPromise = checkNetworkStatus();

export async function queryUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  // Wait for network check to complete
  await networkCheckPromise;

  // Use the safe database operation with fallback capabilities
  const userData = await safeDbOperation(
    async () => {
      return prisma.user.findUnique({
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
    },
    null, // Default value if offline
    {
      cacheDuration: 10 * 60 * 1000, // 10-min cache
      params: { email: user.email }, // Add parameters for cache key generation
    }
  );

  if (!userData) {
    return null;
  }

  return userData;
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
      isOfflineError:
        errorMessage.includes("timeout") || errorMessage.includes("network"),
    };
    console.warn("Error fetching user data:", e);
  }

  return { data, error };
}

// Safely get user by ID with offline fallback
export async function getUserById(userId: number) {
  return safeDbOperation(
    async () => {
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
    },
    null,
    {
      cacheDuration: 10 * 60 * 1000, // 10 minutes
      params: { userId },
    }
  );
}

// Safely get user's groups with offline fallback
export async function getUserGroups(userId: number) {
  return safeDbOperation(
    async () => {
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
    },
    [], // Empty array as fallback
    {
      cacheDuration: 10 * 60 * 1000, // 10 min cache
      params: { userId },
    }
  );
}
