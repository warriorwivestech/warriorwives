import prisma from "@/app/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // const { userId } = params;

  const data = await prisma.membersOnGroups.findMany({
    where: {
      userId: 3,
    },
    include: {
      group: {
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
        },
      },
    },
  });

  return Response.json(data);
}
