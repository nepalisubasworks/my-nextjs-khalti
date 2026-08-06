import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json()

    if (!mobile) {
      return NextResponse.json(
        { message: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Log the attempt (for phishing practical – track who is trying)
    console.log(`🔐 Forgot password request for: ${mobile}`)

    // You could store this in a PasswordResetAttempt table if needed.

    // Always return success – we don't send any OTP from web.
    return NextResponse.json(
      {
        message: 'Recovery instructions sent to your Khalti app.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}