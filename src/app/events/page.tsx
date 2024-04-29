import { getJoinedEvents } from "../../data/joinedEvents";
import { TypographyH3 } from "@/components/ui/typography/h3";
import EventsData from "./components/EventsData";

export default async function EventsPage() {
  const { data: events, error } = await getJoinedEvents();

  return (
    <>
      <div className="flex flex-col gap-8">
        <TypographyH3>My Events</TypographyH3>
        <EventsData events={events} error={error} />
      </div>
    </>
  );
}
