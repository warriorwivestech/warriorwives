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
}
