import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSignInPage() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Admin Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button className="w-full">Sign in with Google</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
