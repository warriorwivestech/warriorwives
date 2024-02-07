export type Event = {
  id: number
  name: string
  description: string
  displayPhoto: string | null
  location: string | null
  meetingLink: string | null
  dateTime: string
  online: boolean
  createdAt: string
  updatedAt: string
  groupId: number
  _count: {
    attendees: number
  }
}
