import { auth } from "@/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";

export default async function UserVerifiedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/sign-in");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
  });

  if (!userData) {
    return redirect("/sign-up");
  }

  if (!userData.manualVerified) {
    return redirect("/verification");
  }

  return <>{children}</>;
}
