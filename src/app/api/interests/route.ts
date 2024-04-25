import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import { InterestsFormValues } from "@/app/all-groups/components/EditInterestsModal";

async function queryInterests() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await prisma.interest.findMany({
    // sort interests by name
    orderBy: {
      name: "asc",
    },
  });
}

export type InterestsType = Prisma.PromiseReturnType<typeof queryInterests>;

export async function GET() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const queriedInterests = await queryInterests();

  return Response.json(queriedInterests);
}

export async function PUT(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json(
      { data: null, error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const userIsSuperUser = await queryUserIsSuperUser(user.email as string);
  if (!userIsSuperUser) {
    return Response.json(
      { data: null, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const body: InterestsFormValues = await request.json();
  const updatedInterests = body.interests;
  const interests = await queryInterests();

  // it has an ID of 0, it means it's a new interest
  const interestsToCreate = updatedInterests.filter(
    (interest) => interest.id === 0
  );
  // value is different from the existing interest
  const interestsToUpdate = updatedInterests.filter(
    (interest) =>
      interest.id !== 0 &&
      interests.find((existingInterest) => existingInterest.id === interest.id)
        ?.name !== interest.value
  );
  const interestsToDelete = interests.filter(
    (interest) =>
      !updatedInterests.some(
        (updatedInterest) => interest.id === updatedInterest.id
      )
  );

  await prisma.$transaction([
    prisma.interest.createMany({
      data: interestsToCreate.map((interest) => ({
        name: interest.value,
      })),
    }),
    ...interestsToUpdate.map((interest) => {
      return prisma.interest.update({
        where: {
          id: interest.id,
        },
        data: {
          name: interest.value,
        },
      });
    }),
    prisma.interest.deleteMany({
      where: {
        id: {
          in: interestsToDelete.map((interest) => interest.id),
        },
      },
    }),
  ]);

  return Response.json({ data: { success: true } });
}
