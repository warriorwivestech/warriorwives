import * as React from "react";

interface JoinEventTemplateProps {
  name: string;
  eventName: string;
}

export function JoinEventTemplate({ name, eventName }: JoinEventTemplateProps) {
  return (
    <div>
      <h1>Hi, {name}!</h1>
      <span>{`You have just joined ${eventName}. Attached is the calendar invite for this event. See you there!`}</span>
    </div>
  );
}
