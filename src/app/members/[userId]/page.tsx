import UserVerifiedRoute from "@/components/UserVerifiedRoute";
import UserProfilePageClient from "./UserProfilePageClient";
import { SWRProvider } from "@/providers/swrProvider";

export default function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <UserProfilePageClient params={params} />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}
