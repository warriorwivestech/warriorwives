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
  members: {
    admin: boolean
    user: {
      id: number,
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
  members: {
    id: number,
    name: string,
    admin: boolean
  }[]
  membersCount: number
}
