import { Event } from "@prisma/client";
import { Resend } from "resend";
import * as ics from "ics";
import { JoinEventTemplate } from "./components/emails/join-event";

const resend = new Resend(process.env.RESEND_API_KEY);

const convertToICSDatetime = (date: Date): ics.DateTime => {
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

export async function sendJoinEventEmail(
  name: string,
  email: string,
  event: Event
) {
  try {
    const { error, value } = ics.createEvent({
      start: convertToICSDatetime(event.startDateTime as Date),
      end: convertToICSDatetime(event.endDateTime as Date),
      title: event.name,
      description: event.description,
      location: event.location ?? undefined,
    });
    if (error) {
      throw error;
    }

    const data = await resend.emails.send({
      react: JoinEventTemplate({ name, eventName: event.name }),
      // TODO: replace with warriorwives email with domain
      from: "Acme <onboarding@resend.dev>",
      // TODO: replace with user email
      to: ["warriorwivestech@gmail.com"],
      subject: `${event.name} - Calendar Invite`,
      attachments: [
        {
          filename: "calendar.ics",
          content: value,
        },
      ],
    });
    if (data.error) {
      throw error;
    }
  } catch (error) {
    return Response.json({ error });
  }
}
