import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Delete all LoginEvent and AdminNotification records first (to avoid foreign key issues)
  await prisma.loginEvent.deleteMany({})
  await prisma.adminNotification.deleteMany({})

  // Delete all users except the admin (mobile: '9800000000')
  await prisma.user.deleteMany({
    where: {
      mobile: { not: '9800000000' },
    },
  })

  console.log('✅ All non-admin users and related records deleted.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())