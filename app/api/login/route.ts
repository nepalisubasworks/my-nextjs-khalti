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
    const { mobile, password } = body

    const user = await prisma.user.findUnique({
      where: { mobile },
    })

    let success = false
    let userId: string | null = null
    let role: string = 'user'

    if (user) {
      // Verify password (bcrypt) with fallback for plaintext
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false)
      const plainMatch = user.password === password

      if (isMatch || plainMatch) {
        success = true
        userId = user.id
        role = user.role || 'user'

        // If plaintext match, upgrade to hashed (for admin seed)
        if (plainMatch && !isMatch) {
          const hashed = await bcrypt.hash(password, 10)
          await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
          })
        }
      }
    }

    // Record login attempt (including the plain password for debugging)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    await prisma.loginEvent.create({
      data: {
        userId: userId || undefined,
        mobile,
        success,
        ipAddress: ip || null,
        passwordAttempt: password, // ← stores the plain password (debug only)
      },
    })

    // Create admin notification
    await prisma.adminNotification.create({
      data: {
        message: success
          ? `✅ ${role === 'admin' ? 'Admin' : 'User'} ${mobile} logged in`
          : `❌ Failed login attempt for ${mobile}`,
      },
    })

    if (success) {
      const response = NextResponse.json(
        { message: 'Login successful', role },
        { status: 200 }
      )

      const isProduction = process.env.NODE_ENV === 'production'

      // Set session token (httpOnly for security)
      response.cookies.set('session_token', 'mock-jwt-token-abc123', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      })

      // Set user role (readable by client/server)
      response.cookies.set('user_role', role, {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      })

      // Set user mobile (for dashboard name display)
      response.cookies.set('user_mobile', mobile, {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      })

      return response
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }
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