import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

let timeTaken: number = 0
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  timeTaken += (after - before)
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms and total ${timeTaken}ms`)
  return result
})

const main = async () => {
  const { user, userPreference } = prisma

  await user.deleteMany()
  await userPreference.deleteMany()

  const manager1: User = await user.create({
    data: {
      name: 'Manager 1',
      email: 'manager1@gmail.com',
      role: 'Manager',
      userPreference: {
        create: {
          emailUpdates: true
        }
      }
    }
  })
  const manager2: User = await user.create({
    data: {
      name: 'Manager 2',
      email: 'manager2@gmail.com',
      role: 'Manager',
      userPreference: {
        create: {
          emailUpdates: true
        }
      }
    }
  })
  const manager3: User = await user.create({
    data: {
      name: 'Manager 3',
      email: 'manager3@gmail.com',
      role: 'Manager',
      userPreference: {
        create: {
          emailUpdates: true
        }
      }, managedUsers: {
        create: [
          {
            name: 'User 7',
            email: 'user7@gmail.com',
          }, {
            name: 'User 8',
            email: 'user8@gmail.com',
          }, {
            name: 'User 9',
            email: 'user9@gmail.com',
          }, {
            name: 'User 10',
            email: 'user10@gmail.com',
          }
        ]
      }
    }
  })
  const createUsers = await user.createMany({
    data: [{
      name: 'User 1',
      email: 'user1@gmail.com',
      managerId: manager1.id,
    }, {
      name: 'User 2',
      email: 'user2@gmail.com',
      managerId: manager1.id
    }, {
      name: 'User 3',
      email: 'user3@gmail.com',
      managerId: manager2.id
    }, {
      name: 'User 4',
      email: 'user4@gmail.com',
      managerId: manager2.id
    }, {
      name: 'User 5',
      email: 'user5@gmail.com',
      managerId: manager3.id
    }, {
      name: 'User 6',
      email: 'user6@gmail.com',
      managerId: manager3.id
    }]
  })
  const users = await user.findMany({
    skip: 0,
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      manager: {
        select: {
          name: true,
          email: true
        }
      },
      userPreference: {
        select: {
          emailUpdates: true
        }
      }
    }
  })
  console.log("Users before update ==> ", users)
  await user.update({
    where: {
      id: manager1.id
    },
    data: {
      name: 'Manager 1 updated'
    }
  })
  await user.upsert({
    where: {
      email: "manager45@gmail.com"
    },
    update: {
      name: 'Manager 45 updated'
    },
    create: {
      email: "manager45@gmail.com",
      name: 'Manager 45 updated',
    },
  })
  console.log("Users after update ==> ", users)
}

main()
  .catch(e => console.log(e))
  .finally(async () => await prisma.$disconnect())