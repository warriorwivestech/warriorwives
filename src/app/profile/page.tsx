import UserVerifiedRoute from "@/components/UserVerifiedRoute";
import { SWRProvider } from "@/providers/swrProvider";
import ProfilePageClient from "./ProfilePageClient";

export default function ProfilePage() {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <ProfilePageClient />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}
