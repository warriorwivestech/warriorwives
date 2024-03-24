export interface GroupTypes {
  id: number;
  name: string;
  location: string;
  description: string;
  isOnline: boolean;
  tags: Tag[];
  background: string;
}

interface Tag {
  name: string;
  colour: string;
}

export interface NewGroup {
  name: string;
  description: string;
  online: boolean;
  displayPhoto: string;
  county: string;
  state: string;
  branchOfService: string[];
  tags: string[];
  password?: string
  archived: boolean
}

export interface requiredGroupField {
  name: boolean;
  description: boolean;
  branchOfService: boolean;
  tags: boolean;
}

export type FileWithPreview = {
  file: File;
  url: string;
};

export interface LocationType {
  County: string;
  State: string;
}
