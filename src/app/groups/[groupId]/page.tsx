import UserVerifiedRoute from "@/components/UserVerifiedRoute";
import { SWRProvider } from "@/providers/swrProvider";
import GroupPageClient from "./GroupPageClient";

export default function GroupPage({ params }: { params: { groupId: string } }) {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <GroupPageClient params={params} />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}
