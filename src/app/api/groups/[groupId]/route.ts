import prisma from "@/prisma";
import { auth } from "@/auth";
import { Group, Prisma, groupArmyBranch } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";
import { UnparsedUserData, queryUser } from "@/data/user";
import { UnauthenticatedError, UnauthorizedError } from "@/lib/errors";
import { EditGroupFormValues } from "@/components/GroupModal/EditGroup";
import { supabase } from "@/supabase";

function queryGroup(groupId: number) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      tags: {
        select: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}
type UnparsedGroup = Prisma.PromiseReturnType<typeof queryGroup>;

export function queryMemberJoined(groupId: number, userEmail: string) {
  return prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      user: {
        email: userEmail,
      },
    },
  });
}
type UnparsedMemberJoined = Prisma.PromiseReturnType<typeof queryMemberJoined>;

function queryGroupAdmins(groupId: number) {
  return prisma.membersOnGroups.findMany({
    where: {
      groupId,
      admin: true,
    },
    select: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}
type UnparsedGroupAdmins = Prisma.PromiseReturnType<typeof queryGroupAdmins>;

function parseGroupData(
  groupData: UnparsedGroup,
  memberData: UnparsedMemberJoined,
  adminData: UnparsedGroupAdmins,
  userData: UnparsedUserData
) {
  if (!groupData) {
    return null;
  }
  const isAdminOrSuperUser = memberData?.admin || userData?.superUser;

  return {
    ...groupData,
    // DO NOT expose the password to the client unless the user is an admin or super user
    password: isAdminOrSuperUser ? groupData.password : undefined,
    branchOfService: parseBranchOfService(groupData.branchOfService),
    tags: groupData.tags.map((tag) => tag.interest.name),
    membersCount: groupData._count.members,
    joined: memberData ? true : false,
    groupAdmin: memberData ? memberData.admin : false,
    admins: adminData.map((admin) => admin.user.name),
    tagIds: groupData.tags.map((tag) => tag.interest.id),
  };
}

export type GroupDataType = NonNullable<ReturnType<typeof parseGroupData>>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const groupId = Number(params.groupId);

  const [groupData, memberData, adminData, userData] = await Promise.all([
    queryGroup(groupId),
    queryMemberJoined(groupId, user.email as string),
    queryGroupAdmins(groupId),
    queryUser(),
  ]);

  if (!groupData) {
    return Response.json(null);
  }

  const parsedData = groupData
    ? parseGroupData(groupData, memberData, adminData, userData)
    : groupData;

  return Response.json(parsedData);
}

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }

  const groupId = Number(params.groupId);
  const [userData, memberData, groupData] = await Promise.all([
    queryUser(),
    queryMemberJoined(groupId, user.email as string),
    queryGroup(groupId),
  ]);

  if (!userData) {
    throw new Error("User not found");
  }
  if (!groupData) {
    throw new Error("Group not found");
  }
  if (!userData.superUser && !memberData?.admin) {
    throw new UnauthorizedError();
  }
  const body: EditGroupFormValues = await request.json();

  const { displayPhoto: oldDisplayPhoto, tags: oldTags } = groupData;
  const parsedOldTags = oldTags.map((tag) => tag.interest.id);
  const {
    name,
    description,
    displayPhoto,
    online,
    state,
    county,
    branchOfService,
    tags,
    password,
  } = body;

  const passwordEnabled = password ? true : false;
  const displayPhotoChanged = displayPhoto !== oldDisplayPhoto;
  const tagsToCreate = tags.filter((tag) => !parsedOldTags.includes(tag));
  const tagsToDelete = parsedOldTags.filter((tag) => !tags.includes(tag));

  const updatedGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      name,
      description,
      displayPhoto,
      online,
      state,
      county,
      branchOfService: branchOfService as groupArmyBranch,
      tags: {
        create: tagsToCreate.map((tag) => {
          return {
            interest: {
              connect: {
                id: tag,
              },
            },
          };
        }),
        deleteMany: {
          interestId: {
            in: tagsToDelete,
          },
        },
      },
      passwordEnabled,
      password,
    },
  });

  if (displayPhotoChanged) {
    const fileName = oldDisplayPhoto.split("/group-banners/")[1];
    const key = `group-banners/${fileName}`;
    const { data, error } = await supabase.storage
      .from("warrior-wives-test")
      .remove([key]);
  }

  return Response.json(updatedGroup);
}

export type UpdateGroupResponseType = Group;
