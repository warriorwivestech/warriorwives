import prisma from "@/app/prisma";
import { parseGroupData } from "./helpers";

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const { groupId } = params;

  const data = await prisma.group.findUnique({
    where: {
      id: parseInt(groupId),
    },
    include: {
      tags: {
        include: {
          interest: {
            select: {
              name: true,
            },
          },
        },
      },
      members: {
        select: {
          admin: true,
          user: {
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
  const parsedData = data ? parseGroupData(data) : data;

  return Response.json(parsedData);
}
