export type GroupResponse = {
  id: number
  name: string
  description: string
  displayPhoto: string
  branchOfService: string
  county: string | null
  state: string
  online: boolean
  createdAt: Date
  updatedAt: Date
  tags: {
    interest: {
      name: string
    }
  }[]
  _count: {
    members: number
  }
}

export type GroupData = {
  id: number
  name: string
  description: string
  displayPhoto: string
  branchOfService: string
  county: string | null
  state: string
  online: boolean
  createdAt: Date
  updatedAt: Date
  tags: string[]
  joined: boolean
  groupAdmin: boolean
  admins: string[]
  membersCount: number
  password?: string
  archived: boolean
}
