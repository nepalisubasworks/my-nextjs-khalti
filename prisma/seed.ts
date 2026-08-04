import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create regular user
  await prisma.user.upsert({
    where: { mobile: '9800000000' },
    update: {},
    create: {
      mobile: '9800000000',
      password: 'admin123',
      role: 'admin',   // ← set as admin
    },
  })

  console.log('✅ Admin user created: 9800000000 / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())