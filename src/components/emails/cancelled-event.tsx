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

interface CancelledEventEmailProps {
  name: string;
  groupName: string;
  eventName: string;
  groupUrl: string;
}

export const CancelledEventEmail = ({
  name,
  groupName,
  eventName,
  groupUrl,
}: CancelledEventEmailProps) => (
  <Html>
    <Head />
    <Preview>Unfortunately, {eventName} has been cancelled.</Preview>
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
          Unfortunately, <strong>{eventName}</strong> has been cancelled by{" "}
          <strong>{groupName}</strong>.
        </Text>
        <Text style={paragraph}>
          We apologize for any inconvenience this may have caused. You can view
          other events from <strong>{groupName}</strong> by clicking the button
          below.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={groupUrl}>
            View Group
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

CancelledEventEmail.PreviewProps = {
  name: "Jane Doe",
  groupName: "Warrior Wives",
  eventName: "Warrior Wives Meeting",
  groupUrl: "https://localhost:3000/groups/1",
} as CancelledEventEmailProps;

export default CancelledEventEmail;

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
