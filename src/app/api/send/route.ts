import { EmailTemplate } from "@/components/emails/test-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      react: EmailTemplate({ firstName: "John" }),
      from: "Acme <onboarding@resend.dev>",
      to: ["warriorwivestech@gmail.com"],
      subject: "Hello world",
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
