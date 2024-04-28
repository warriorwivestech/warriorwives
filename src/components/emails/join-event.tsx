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

interface JoinedEventEmailProps {
  name: string;
  eventName: string;
  eventUrl: string;
}

export const JoinedEventEmail = ({
  name,
  eventName,
  eventUrl,
}: JoinedEventEmailProps) => (
  <Html>
    <Head />
    <Preview>We&apos;re excited to see you at {eventName}!</Preview>
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
          You&apos;ve signed up for <strong>{eventName}</strong>!
        </Text>
        <Text style={paragraph}>
          Attached is the calendar invite for this event. We can&apos;t wait to
          see you there 🎉
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

JoinedEventEmail.PreviewProps = {
  name: "Alan",
  eventName: "Bible Study Week #1",
  eventUrl: "https://localhost:3000/groups/1/events/1",
} as JoinedEventEmailProps;

export default JoinedEventEmail;

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
