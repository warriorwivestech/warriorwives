export interface GroupTypes {
  id: number,
  name: string,
  location: string,
  description: string,
  isOnline: boolean,
  tags: Tag[],
  background: string,
}

interface Tag {
  name: string,
  colour: string,
}