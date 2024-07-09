import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();

  if (!!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">
            Sign up for Warrior Wives Unite
          </CardTitle>
          <CardDescription className="text-center">
            Welcome! Please sign up using Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button className="w-full">Sign up with Google</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
