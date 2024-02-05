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
  dateTime: Date | null;
  photos: EventPhotoType[] | null;
  materials: EventMaterialType[] | null;
  group: GroupTypes | null;
  groupId: string;
  meetingLink?: string;
  longCard?: Boolean
}

export interface NewEvent {
  name: string;
  description: string;
  location: string;
  online: boolean;
  link: string;
  dateTime: any;
  displayPhoto: string;
  photos: string[];
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