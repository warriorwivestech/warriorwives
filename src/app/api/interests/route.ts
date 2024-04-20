import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

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
