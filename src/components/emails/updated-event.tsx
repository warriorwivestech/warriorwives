import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface UpdatedEventEmailProps {
  name: string;
  eventName: string;
  eventUrl: string;
}

export const UpdatedEventEmail = ({
  name,
  eventName,
  eventUrl,
}: UpdatedEventEmailProps) => (
  <Html>
    <Head />
    <Preview>We&apos;ve updated some event details for {eventName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
          height="50"
          alt="Warrior Wives Logo"
          style={logo}
        />
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          We&apos;ve updated some details for <strong>{eventName}</strong>.
          Updates include either the date, time, or location, so please review
          the event details.
        </Text>
        <Text style={paragraph}>
          Attached is the calendar invite with the updated event details. Do
          replace the old calendar invite with this new one. See you there! 🎉
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={eventUrl}>
            View Event
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Warrior Wives, 9998 Academic Avenue #1009 Point Lookout, Missouri
          65726-1009
        </Text>
      </Container>
    </Body>
  </Html>
);

UpdatedEventEmail.PreviewProps = {
  name: "Alan",
  eventName: "Bible Study Week #1",
  eventUrl: "https://localhost:3000/groups/1/events/1",
} as UpdatedEventEmailProps;

export default UpdatedEventEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "black",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  width: "100px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
