import prisma from "@/prisma";

export async function queryUserIsSuperUser(userEmail: string) {
  const userData = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return userData?.superUser;
}
