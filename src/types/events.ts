import { ChangeEvent } from "react";
import { GroupTypes } from "./groups";

export interface EventPhotoType {
  id: number;
  eventId: number;
  photo: string;
}

export interface EventMaterialType {
  id: number;
  eventId: number;
  material: string;
}

export interface EventType {
  id: number;
  name: string;
  description: string;
  displayPhoto: string;
  location: string;
  online: boolean;
  dateTime: Date | null | string;
  photos: EventPhotoType[] | null;
  materials: EventMaterialType[] | null;
  group: GroupTypes | null;
  groupId: number;
  meetingLink?: string | null | undefined;
  longCard?: Boolean;
  attendees: any[];
}

export interface EventDetailsProps {
  id?: number;
  name: string;
  description: string;
  displayPhoto: string | null;
  location: string | null;
  meetingLink: string | null;
  startDateTime: Date | null;
  endDateTime: Date | null;
  online: boolean;
  attendees?: string[];
  photos: string[];
  organizers?: string[];
  joined?: boolean;
  groupName?: string;
  groupId?: number;
}

export interface requiredEventField {
  name: boolean;
  description: boolean;
  dateTime: boolean;
}

export type FileWithPreview = {
  file: File;
  url: string;
};

export type InputChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export interface HandleInputChangeParams {
  e: InputChangeEvent | string;
  inputType: string;
}
