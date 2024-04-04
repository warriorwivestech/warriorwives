export type Group = {
  id: number;
  name: string;
  description: string;
  displayPhoto: string;
  branchOfService: string;
  county: string | null;
  state: string;
  online: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};
