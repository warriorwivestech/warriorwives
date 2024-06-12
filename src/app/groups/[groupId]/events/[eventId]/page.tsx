import UserVerifiedRoute from "@/components/UserVerifiedRoute";
import { SWRProvider } from "@/providers/swrProvider";
import EventPageClient from "./EventPageClient";

export default function EventPage({
  params,
}: {
  params: { groupId: string; eventId: string };
}) {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <EventPageClient params={params} />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}
