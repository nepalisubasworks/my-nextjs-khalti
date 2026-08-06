import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp, password } = await req.json()

    if (!mobile || !otp || !password) {
      return NextResponse.json(
        { message: 'Mobile, OTP, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { mobile },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify OTP
    if (user.resetOtp !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (user.resetOtpExpiry && new Date() > user.resetOtpExpiry) {
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiry: null,
      },
    })

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}