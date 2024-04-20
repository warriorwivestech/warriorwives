import * as React from "react";

interface NewEventTemplateProps {
  groupId: number;
  groupName: string;
  eventId: number;
  eventName: string;
}

// TODO: change this to proper domain
const getURL = (groupId: number, eventId: number) => `http://localhost:3000/groups/${groupId}/events/${eventId}`

export function NewEventTemplate({ groupId, groupName, eventId, eventName }: NewEventTemplateProps) {
  return (
    <div>
      <h1>Hello from Warrior Wives!</h1>
      <div>{`Your Warrior Wives group ${groupName} is hosting a new event ${eventName}.`}</div>
      <span>Join by clicking on <a href={getURL(groupId, eventId)}>this link!</a></span>
    </div>
  );
}
