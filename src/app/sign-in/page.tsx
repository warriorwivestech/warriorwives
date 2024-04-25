import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInCard from "./components/SignInCard";

export default async function SignInPage() {
  const session = await auth();

  if (!!session?.user) {
    redirect("/");
  }

  return <SignInCard />;
}
