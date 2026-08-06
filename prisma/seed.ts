import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { mobile: '9800000000' },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      mobile: '9800000000',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Admin user created: 9800000000 / admin123 (hashed password)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())