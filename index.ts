import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const main = async () => {
  await prisma.user.deleteMany()
  await prisma.userPreference.deleteMany()
  const users = await prisma.user.createMany({
    data: [{
      name: 'Haseeb',
      email: 'haseeb.u1@gmail.com',
    }, {
      name: 'Haseeb',
      email: 'haseeb.u2@gmail.com',
    }]
  })
}

main()
  .catch(e => console.log(e))
  .finally(async () => await prisma.$disconnect())