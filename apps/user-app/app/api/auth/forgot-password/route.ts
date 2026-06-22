import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request: Request) {
  try {
    const { target } = await request.json();

    if (!target) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      );
    }

    // Check if user exists by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: target },
          { number: target }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email or phone number" },
        { status: 404 }
      );
    }

    // Generate a 6-digit OTP code for password reset
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await prisma.otp.create({
      data: {
        target,
        code,
        expiresAt,
      },
    });

    // Output to console for server-side verification
    console.log(`\n--- [PASSWORD RESET SERVICE] Reset OTP for ${target} is: ${code} ---\n`);

    return NextResponse.json({
      message: "Reset code sent successfully. Check console log.",
      otp: code, // returned for verification ease in development
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to request password reset" },
      { status: 500 }
    );
  }
}
