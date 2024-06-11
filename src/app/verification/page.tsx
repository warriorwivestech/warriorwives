import { getUser } from "@/data/user";
import SheerIdForm from "./SheerIdForm";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const user = await getUser();

  if (!user.data) {
    return redirect("/sign-up");
  }

  const userData = user.data;

  if (userData.manualVerified) {
    return redirect("/");
  }

  if (userData.sheerIdVerified && !userData.manualVerified) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-2">
        <div className="font-semibold">You have been manually unverified.</div>
        <div className="text-gray-600 text-center">
          To protect our community, we revoked your access to the platform. If
          you believe this is an error, please contact us.
        </div>
      </div>
    );
  }

  return <SheerIdForm user={userData} />;
}
