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

interface NewEventEmailProps {
  name: string;
  groupName: string;
  eventName: string;
  eventUrl: string;
}

export const NewEventEmail = ({
  name,
  groupName,
  eventName,
  eventUrl,
}: NewEventEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {groupName} has scheduled a new event: {eventName}!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="/logo.png" height="50" alt="Koala" style={logo} />
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          <strong>{groupName}</strong> has scheduled a new event:{" "}
          <strong>{eventName}</strong>!
        </Text>
        <Text style={paragraph}>
          We would love to see you there. Click the button below to view the
          event details.
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

NewEventEmail.PreviewProps = {
  name: "Alan",
  groupName: "Warrior Wives Christian Fellowship",
  eventName: "Bible Study Week #1",
  eventUrl: "https://localhost:3000/groups/1/events/1",
} as NewEventEmailProps;

export default NewEventEmail;

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
