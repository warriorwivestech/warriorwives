import { Event, User } from "@prisma/client";
import { Resend } from "resend";
import * as ics from "ics";
import { JoinedEventEmail } from "./components/emails/join-event";
import { NewEventEmail } from "./components/emails/new-event";

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

export async function sendJoinEventEmail(
  user: User,
  event: Event,
  groupName: string
) {
  try {
    const { error, value } = ics.createEvent({
      start: convertToICSDatetime(event.startDateTime),
      end: convertToICSDatetime(event.endDateTime),
      title: event.name,
      description: event.description,
      location: event.location ?? undefined,
      organizer: {
        name: groupName ?? undefined,
        email: process.env.NOTIFICATIONS_EMAIL,
      },
      url: event.meetingLink ? event.meetingLink : undefined,
    });
    if (error) {
      throw error;
    }
    const data = await resend.emails.send({
      react: JoinedEventEmail({
        name: user.name as string,
        eventName: event.name,
        eventUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${event.groupId}/events/${event.id}`,
      }),
      from: `Warrior Wives <${process.env.NOTIFICATIONS_EMAIL}>`,
      to: [user.email as string],
      subject: `See you at ${event.name}!`,
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
    return data;
  } catch (error) {
    return error;
  }
}

// export async function sendNewEventEmail(
//   emails: string[],
//   groupId: number,
//   groupName: string,
//   eventId: number,
//   eventName: string,
// ) {
//   try {
//     const data = await resend.emails.send({
//       react: NewEventTemplate({ groupId, groupName, eventId, eventName }),
//       // TODO: replace with warriorwives email with domain
//       from: warriorwivesEmail,
//       // TODO: replace with user emails
//       to: ["warriorwivestech@gmail.com"],
//       subject: `New Event from ${groupName}!`,
//     });
//     if (data.error) {
//       throw data.error;
//     }
//   } catch (error) {
//     return error;
//   }
// }
