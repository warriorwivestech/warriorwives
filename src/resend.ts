import { Event } from "@prisma/client";
import { Resend } from "resend";
import * as ics from "ics";
import { JoinEventTemplate } from "./components/emails/join-event";
import { NewEventTemplate } from "./components/emails/new-event";

const resend = new Resend(process.env.RESEND_API_KEY);

const convertToICSDatetime = (date: Date): ics.DateTime => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

const warriorwivesEmail = "Acme <onboarding@resend.dev>";

export async function sendJoinEventEmail(
  name: string,
  email: string,
  organizerName: string | undefined,
  organizerEmail: string | undefined,
  event: Event,
) {
  try {
    const { error, value } = ics.createEvent({
      start: convertToICSDatetime(event.startDateTime as Date),
      end: convertToICSDatetime(event.endDateTime as Date),
      title: event.name,
      description: event.description,
      location: event.location ?? undefined,
      organizer: { name: organizerName ?? undefined, email: organizerEmail ?? undefined },
      url: (!event.meetingLink || event.meetingLink === '') ? undefined : event.meetingLink,
    });
    if (error) {
      throw error;
    }

    const data = await resend.emails.send({
      react: JoinEventTemplate({ name, eventName: event.name }),
      // TODO: replace with warriorwives email with domain
      from: warriorwivesEmail,
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
      throw data.error;
    }
  } catch (error) {
    return error;
  }
}

export async function sendNewEventEmail(
  emails: string[],
  groupId: number,
  groupName: string,
  eventId: number,
  eventName: string,
) {
  try {
    const data = await resend.emails.send({
      react: NewEventTemplate({ groupId, groupName, eventId, eventName }),
      // TODO: replace with warriorwives email with domain
      from: warriorwivesEmail,
      // TODO: replace with user emails
      to: ["warriorwivestech@gmail.com"],
      subject: `New Event from ${groupName}!`,
    });
    if (data.error) {
      throw data.error;
    }
  } catch (error) {
    return error;
  }
}
