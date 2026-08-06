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
    const body = await req.json()
    const { fullName, mobile, email, dob, gender, password } = body

    // Validate required fields
    if (!fullName || !mobile || !password) {
      return NextResponse.json(
        { message: 'Full name, mobile, and password are required' },
        { status: 400 }
      )
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character' },
        { status: 400 }
      )
    }

    // Check if mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Mobile number already registered' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with all fields
    const newUser = await prisma.user.create({
      data: {
        fullName,
        mobile,
        email: email || null,
        dob: dob || null,
        gender: gender || null,
        password: hashedPassword,
        role: 'user',
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser.id },
      { status: 201 }
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