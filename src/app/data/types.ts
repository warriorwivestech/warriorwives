type TagByGroupId = {
  groupId: number
  interestId: number
  interest: {
    name: string
  }
}

type GroupByUserId = {
  groupId: number
  userId: number
  admin: boolean
  group: {
    id: number
    name: string
    description: string
    displayPhoto: string
    branchOfService: string
    county: string
    state: string
    online: boolean
    createdAt: string
    updatedAt: string
    tags: TagByGroupId[]
  }
}

export type GroupsByUserIdResponse = GroupByUserId[]
